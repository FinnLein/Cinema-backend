import { YANDEX_AUTH_OPTIONS } from '@app/common/constants/providers.constant'
import { IYandexProfile } from '@app/common/types/social/yandex.types'
import { REDIS_CLIENT } from '@app/database/redis/redis.constants'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { BaseOAuthProvider } from './base-oauth.provider'
import { type TProviderOptions } from './types/provider-options.types'
import { TUserInfo } from './types/user-info.types'

@Injectable()
export class YandexProvider extends BaseOAuthProvider {
	constructor(
		@Inject(YANDEX_AUTH_OPTIONS) options: TProviderOptions,
		@Inject(REDIS_CLIENT) redis: Redis,
		config: ConfigService
	) {
		super({
			client_id: options.client_id,
			client_secret: options.client_secret,
			scope: options.scope,
			authorize_uri: 'https://oauth.yandex.ru/authorize',
			access_uri: 'https://oauth.yandex.ru/token',
			profile_uri: 'https://login.yandex.ru/info?format=json',
			name: 'yandex'
		}, redis, config)
	}

	protected transformUserInfo(data: IYandexProfile): TUserInfo {
		return super.transformUserInfo({
			id: data.id,
			username: data.display_name,
			email: data.default_email,
			picture: data.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200` : undefined
		})
	}
}