import { EMAIL_CLIENT, JWT_TOKENS_CLIENT, USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { LoginDto } from '@app/contracts/auth/login.dto'
import { RegisterDto } from '@app/contracts/auth/register.dto'
import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { JWT_TOKENS_PATTERNS } from '@app/contracts/jwt-tokens/jwt-tokens.patterns'
import { CreateUserDto } from '@app/contracts/users/create-user.dto'
import { AuthMethod, UserDto } from '@app/contracts/users/user.dto'
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { verify } from 'argon2'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
    @Inject(EMAIL_CLIENT) private readonly emailClient: ClientProxy,
    @Inject(JWT_TOKENS_CLIENT) private readonly jwtTokensClient: ClientProxy,
  ) { }

  public async login(dto: LoginDto) {
    const user = await this.validateUser(dto)

    if (!user.isVerified) {
      await lastValueFrom(this.emailClient.send(EMAIL_PATTERNS.CONFIRM_EMAIL, dto.email))
      return { message: "Your email not confirmed. Please confirm your email and then try again." }
    }

    if (!user.isTwoFactor) {
      return lastValueFrom(this.jwtTokensClient.send<{ accessToken: string, refreshToken: string }>(JWT_TOKENS_PATTERNS.GENERATE, { id: user.id, role: user.role }))
    }

    if (!dto.code) {
      await lastValueFrom(this.emailClient.send(EMAIL_PATTERNS.SEND_2FA, dto.email))
      return { message: "We have sent 2FA token to your email. Please check your email." }
    }

    return lastValueFrom(this.emailClient.send(EMAIL_PATTERNS.VERIFY_2FA, dto.code))
  }

  public async register(dto: RegisterDto) {
    const user = await lastValueFrom(this.usersClient.send(USERS_PATTERNS.FIND_BY_EMAIL, dto.email))

    if (user) throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: "User with this email already exist. Try the other email or recover your account." })

    await lastValueFrom(this.usersClient.send<UserDto, CreateUserDto>(USERS_PATTERNS.CREATE, {
      username: dto.username,
      email: dto.email,
      password: dto.password,
      authMethod: AuthMethod.CREDENTIALS,
      isVerified: false
    }))

    await lastValueFrom(this.emailClient.send(EMAIL_PATTERNS.CONFIRM_EMAIL, dto.email))

    return { message: 'You have successfully registered!Verify your email.' }
  }

  public async logout(refreshToken: string) {
    return this.jwtTokensClient.send(JWT_TOKENS_PATTERNS.BLACKLIST, refreshToken)
  }

  private async validateUser(dto: LoginDto) {
    const user = await lastValueFrom(this.usersClient.send<UserDto>(USERS_PATTERNS.FIND_BY_EMAIL, dto.email))

    if (!user) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: "User with this email not found" })

    const isValid = await verify(user.password, dto.password)

    if (!isValid) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid password' })

    return user
  }
}
