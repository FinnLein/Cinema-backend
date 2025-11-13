import { AUTH_CLIENT } from '@app/common/client-config/clients.constants'
import { Auth } from '@app/common/decorators/auth.decorator'
import { type TOAuthProviders } from '@app/common/types/social/oauth-providers.types'
import { LoginDto } from '@app/contracts/auth/login.dto'
import { RegisterDto } from '@app/contracts/auth/register.dto'
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Throttle } from '@nestjs/throttler'
//! Very bad decision. It's directly from microservices
import { ProvidersService } from 'apps/auth/src/oauth/providers.service'
import { type Response } from 'express'
import { AuthService } from './auth.service'
import { RefreshToken } from './decorators/refresh-token.decorator'
import { ProvidersGuard } from './guards/providers.guard'
import { TokensService } from './tokens.service'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_CLIENT) private readonly authClient: ClientProxy,
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly config: ConfigService,
    private readonly providersService: ProvidersService
  ) {
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 300 } })
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken, ...response } = await this.authService.login(dto)

    this.tokensService.addAccessTokenToResponse(accessToken, res)
    this.tokensService.addRefreshTokenToResponse(refreshToken, res)

    return response
  }

  @Post('logout')
  @Auth()
  @HttpCode(HttpStatus.OK)
  public async logout(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logout(refreshToken)

    this.tokensService.removeTokenFromResponse(res)

    return { message: 'You have successfully log out.' }
  }

  @UseGuards(ProvidersGuard)
  @Get('oauth/connect/:provider')
  @HttpCode(HttpStatus.OK)
  public async connect(
    @Param('provider') provider: TOAuthProviders,
    @Res({ passthrough: true }) res: Response
  ) {
    const providerInstance = this.providersService.getByProvider(provider)

    const { state, url } = await providerInstance.getAuthorizationUri()

    this.tokensService.addTokenToResponse({
      name: 'oauth_state',
      value: state,
      expires: new Date(Date.now() + 15 * 60 * 1000),
      httpOnly: true,
      res
    })

    return {
      url
    }
  }

  @UseGuards(ProvidersGuard)
  @Get('oauth/callback/:provider')
  public async callback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Query('state') state: string,
    @Param('provider') provider: TOAuthProviders,
    @Res({ passthrough: true }) res: Response
  ) {
    if (error) throw new UnauthorizedException(`OAuth error:${error}`)

    const { accessToken, refreshToken } = await this.authService.oauth(code, provider, state)

    this.tokensService.addAccessTokenToResponse(accessToken, res)
    this.tokensService.addRefreshTokenToResponse(refreshToken, res)

    return res.redirect(this.config.getOrThrow<string>('ALLOWED_ORIGIN') + '/profile')
  }

}
