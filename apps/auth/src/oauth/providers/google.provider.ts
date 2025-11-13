import { GOOGLE_AUTH_OPTIONS } from '@app/common/constants/providers.constant'
import { IGoogleProfile } from '@app/common/types/social/google.types'
import { REDIS_CLIENT } from '@app/database/redis/redis.constants'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { BaseOAuthProvider } from './base-oauth.provider'
import { type TProviderOptions } from './types/provider-options.types'
import { TUserInfo } from './types/user-info.types'

@Injectable()
export class GoogleProvider extends BaseOAuthProvider {
	constructor(
		@Inject(GOOGLE_AUTH_OPTIONS) options: TProviderOptions,
		@Inject(REDIS_CLIENT) redis: Redis,
		config: ConfigService
	) {
		super({
			client_id: options.client_id,
			client_secret: options.client_secret,
			scope: options.scope,
			authorize_uri: 'https://accounts.google.com/o/oauth2/v2/auth',
			access_uri: 'https://oauth2.googleapis.com/token',
			profile_uri: 'https://www.googleapis.com/oauth2/v3/userinfo',
			name: 'google'
		}, redis, config)
	}

	protected transformUserInfo(data: IGoogleProfile): TUserInfo {
		return super.transformUserInfo({
			id: data.sub,
			username: data.name,
			email: data.email,
			picture: data.picture
		})
	}
}
