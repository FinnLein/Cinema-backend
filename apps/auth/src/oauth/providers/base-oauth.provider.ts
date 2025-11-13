import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RpcException } from '@nestjs/microservices'
import { randomBytes } from 'crypto'
import Redis from 'ioredis'
import { type TBaseProviderOptions } from './types/base-provider-options.types'
import { TTokenResponse } from './types/token-response.types'
import { TUserInfo } from './types/user-info.types'



@Injectable()
export abstract class BaseOAuthProvider {
	constructor(
		private readonly options: TBaseProviderOptions,
		protected readonly redis: Redis,
		protected readonly config: ConfigService
	) { }
	get name() {
		return this.options.name
	}

	public getRedirectUri(): string {
		return `${this.config.getOrThrow<string>('APPLICATION_URL')}/auth/oauth/callback/${this.name}`
	}

	public async getAuthorizationUri() {
		const state = await this.generateState()

		const params = new URLSearchParams({
			response_type: 'code',
			access_type: 'offline',
			prompt: 'consent',
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUri(),
			scope: (this.options.scope ?? []).join(' '),
			state
		})

		return {
			url: `${this.options.authorize_uri}?${params}`,
			state
		}
	}

	public async exchangeCodeForToken(code: string) {
		const data = new URLSearchParams({
			client_id: this.options.client_id,
			client_secret: this.options.client_secret,
			redirect_uri: this.getRedirectUri(),
			grant_type: 'authorization_code',
			code
		})

		try {
			const request = await fetch(this.options.access_uri, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json',
				},
				body: data.toString(),
				signal: AbortSignal.timeout(30_000)
			})

			const response = await request.json() as TTokenResponse

			if (!response.access_token) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: `Access token did not receive from ${this.options.access_uri}` })

			return response
		} catch (error) {
			throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Failed to exchange code for token' })
		}
	}

	public async getProfileInfo(dto: TTokenResponse) {
		const headers = {
			'Authorization': `Bearer ${dto.access_token}`,
			'Accept': 'application/json'
		}

		try {
			const request = await fetch(this.options.profile_uri, {
				method: 'Get',
				headers,
				signal: AbortSignal.timeout(30_000)
			})

			const user = await request.json()
			const userData = this.transformUserInfo(user)

			return {
				...userData,
				access_token: dto.access_token,
				refresh_token: dto.refresh_token,
				expires_in: dto.expires_in
			}
		} catch (error) {
			throw new RpcException({ statusCode: error.status, message: error.message })
		}
	}

	protected transformUserInfo(data: any): TUserInfo {
		return {
			...data,
			provider: this.name
		}
	}

	private async generateState() {
		const state = randomBytes(32).toString('base64url')
		await this.redis.set(`oauth_state:${state}`, '1', 'EX', 900)
		return state
	}
}