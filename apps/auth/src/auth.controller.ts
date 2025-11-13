import { TOAuthProviders } from '@app/common/types/social/oauth-providers.types'
import { AUTH_PATTERNS } from '@app/contracts/auth/auth.patterns'
import { LoginDto } from '@app/contracts/auth/login.dto'
import { RegisterDto } from '@app/contracts/auth/register.dto'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  public async login(@Payload() dto: LoginDto) {
    return this.authService.login(dto)
  }
  @MessagePattern(AUTH_PATTERNS.REGISTER)
  public async register(@Payload() dto: RegisterDto) {
    return this.authService.register(dto)
  }
  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  public async logout(@Payload() refreshToken: string) {
    return this.authService.logout(refreshToken)
  }

  @MessagePattern(AUTH_PATTERNS.OAUTH)
  public async oauth(@Payload() payload: { code: string, provider: TOAuthProviders, state: string }) {
    return this.authService.oauth(payload.code, payload.provider, payload.state)
  }
}
