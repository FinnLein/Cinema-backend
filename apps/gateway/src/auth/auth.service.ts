import { AUTH_CLIENT } from '@app/common/client-config/clients.constants'
import { TOAuthProviders } from '@app/common/types/social/oauth-providers.types'
import { AUTH_PATTERNS } from '@app/contracts/auth/auth.patterns'
import { IAuthResponse } from '@app/contracts/auth/auth.types'
import { LoginDto } from '@app/contracts/auth/login.dto'
import { RegisterDto } from '@app/contracts/auth/register.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
	constructor(
		@Inject(AUTH_CLIENT) private readonly authClient: ClientProxy
	) { }

	public async register(dto: RegisterDto) {
		return lastValueFrom(this.authClient.send(AUTH_PATTERNS.REGISTER, dto))
	}

	public async login(dto: LoginDto) {
		return lastValueFrom(this.authClient.send<IAuthResponse>(AUTH_PATTERNS.LOGIN, dto))
	}

	public async logout(refreshToken: string) {
		return lastValueFrom(this.authClient.send(AUTH_PATTERNS.LOGOUT, refreshToken))
	}

	public async oauth(code: string, provider: TOAuthProviders, state: string) {
		return lastValueFrom(this.authClient.send<IAuthResponse>(AUTH_PATTERNS.OAUTH, { code, provider, state }))
	}
}
