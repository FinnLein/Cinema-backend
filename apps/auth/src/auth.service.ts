import { ACCOUNTS_CLIENT, EMAIL_CLIENT, JWT_TOKENS_CLIENT, USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { TOAuthProviders } from '@app/common/types/social/oauth-providers.types'
import { CreateAccountDto } from '@app/contracts/accounts/account-create.dto'
import { AccountDto } from '@app/contracts/accounts/account.dto'
import { ACCOUNTS_PATTERNS } from '@app/contracts/accounts/accounts.patterns'
import { LoginDto } from '@app/contracts/auth/login.dto'
import { RegisterDto } from '@app/contracts/auth/register.dto'
import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { JWT_TOKENS_PATTERNS } from '@app/contracts/jwt-tokens/jwt-tokens.patterns'
import { TwoFactorDto } from '@app/contracts/tokens/two-factor.dto'
import { CreateUserDto } from '@app/contracts/users/create-user.dto'
import { AuthMethod, UserDto } from '@app/contracts/users/user.dto'
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns'
import { REDIS_CLIENT } from '@app/database/redis/redis.constants'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { hash, verify } from 'argon2'
import Redis from 'ioredis'
import { lastValueFrom } from 'rxjs'
import { ProvidersService } from './oauth/providers.service'

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
    @Inject(EMAIL_CLIENT) private readonly emailClient: ClientProxy,
    @Inject(JWT_TOKENS_CLIENT) private readonly jwtTokensClient: ClientProxy,
    @Inject(ACCOUNTS_CLIENT) private readonly accountsClient: ClientProxy,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly providerService: ProvidersService
  ) { }

  public async login(dto: LoginDto) {
    const user = await this.validateUser(dto)

    if (!user.isVerified) {
      await lastValueFrom(this.emailClient.send(EMAIL_PATTERNS.SEND_CONFIRMATION_TOKEN, dto.email))
      return { message: "Your email not confirmed. Please confirm your email and then try again." }
    }

    if (!user.isTwoFactor) {
      return lastValueFrom(this.jwtTokensClient.send<{ accessToken: string, refreshToken: string }>(JWT_TOKENS_PATTERNS.GENERATE, { id: user.id, role: user.role }))
    }

    if (!dto.token) {
      await lastValueFrom(this.emailClient.send(EMAIL_PATTERNS.SEND_2FA, dto.email))
      return { message: "We have sent 2FA token to your email. Please check your email." }
    }

    await lastValueFrom(this.emailClient.send<any, TwoFactorDto>(EMAIL_PATTERNS.VERIFY_2FA, {token: dto.token}))

    return lastValueFrom(this.jwtTokensClient.send<{ accessToken: string, refreshToken: string }>(JWT_TOKENS_PATTERNS.GENERATE, { id: user.id, role: user.role }))
  }

  public async register(dto: RegisterDto) {
    const existingUser = await lastValueFrom(
      this.usersClient.send<UserDto>(USERS_PATTERNS.GET_BY_EMAIL, dto.email)
    )

    if (existingUser) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: "User with this email already exist. Try the other email or recover your account."
      })
    }
    await lastValueFrom(
      this.usersClient.send<UserDto, CreateUserDto>(USERS_PATTERNS.CREATE, {
        username: dto.username,
        email: dto.email,
        password: dto.password,
        method: AuthMethod.CREDENTIALS,
        isVerified: false
      })
    )

    await lastValueFrom(this.emailClient.send(EMAIL_PATTERNS.SEND_CONFIRMATION_TOKEN, dto.email))

    return { message: 'You have successfully registered! Verify your email.' }
  }

  public async logout(refreshToken: string) {
    return this.jwtTokensClient.send(JWT_TOKENS_PATTERNS.BLACKLIST, refreshToken)
  }

  public async oauth(token: string, provider: TOAuthProviders, state: string) {
    const isValid = await this.redis.get(`oauth_state:${state}`)
    if (!isValid) throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid state' })
    await this.redis.del(`oauth_state:${state}`)

    const instance = this.providerService.getByProvider(provider)
    const tokenResponse = await instance.exchangeCodeForToken(token)
    const profile = await instance.getProfileInfo(tokenResponse)

    const account = await lastValueFrom(this.accountsClient.send<AccountDto>(ACCOUNTS_PATTERNS.GET_BY_PROVIDER_ID, { providerId: profile.id, provider: profile.provider.toUpperCase() }))


    let user = account?.userId ? await lastValueFrom(this.usersClient.send<UserDto, string>(USERS_PATTERNS.GET_BY_ID, account.userId)) : null

    if (!user) {
      try {
        const password = Math.random().toString(36).substring(2, 15)
        user = await lastValueFrom(this.usersClient.send<UserDto, CreateUserDto>(USERS_PATTERNS.CREATE, {
          username: profile.username,
          email: profile.email,
          password,
          picture: profile.picture,
          isVerified: true,
          method: AuthMethod[profile.provider.toUpperCase()]
        }))
        if (!account) {
          await lastValueFrom(this.accountsClient.send<AccountDto, CreateAccountDto>(ACCOUNTS_PATTERNS.CREATE, {
            userId: user.id,
            providerId: profile.id,
            provider: AuthMethod[profile.provider.toUpperCase()],
            accessToken: await hash(profile.access_token),
            refreshToken: await hash(profile.refresh_token),
            expiresIn: profile.expires_in,
            type: 'oauth'
          }))
        }
      } catch (error) {
        throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: error.message })
      }
    }

    return lastValueFrom(this.jwtTokensClient.send(JWT_TOKENS_PATTERNS.GENERATE, { id: user.id, role: user.role }))
  }

  private async validateUser(dto: LoginDto) {
    const user = await lastValueFrom(this.usersClient.send<UserDto>(USERS_PATTERNS.GET_BY_EMAIL, dto.email))

    if (!user) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: "User with this email not found" })

    const isValid = await verify(user.password, dto.password)

    if (!isValid) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid password' })

    return user
  }
}
