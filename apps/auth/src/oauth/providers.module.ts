import { GOOGLE_AUTH_OPTIONS, OAUTH_PROVIDERS, YANDEX_AUTH_OPTIONS } from '@app/common/constants/providers.constant'
import { RedisModule } from '@app/database/redis/redis.module'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ProvidersController } from './providers.controller'
import { ProvidersService } from './providers.service'
import { GoogleProvider } from './providers/google.provider'
import { TProviderOptions } from './providers/types/provider-options.types'
import { YandexProvider } from './providers/yandex.provider'

@Module({
	imports: [RedisModule],
	controllers: [ProvidersController],
	providers: [
		{
			provide: GOOGLE_AUTH_OPTIONS,
			useFactory: (config: ConfigService): TProviderOptions => ({
				client_id: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
				client_secret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
				scope: ['email', 'profile']
			}),
			inject: [ConfigService]
		},
		{
			provide: YANDEX_AUTH_OPTIONS,
			useFactory: (config: ConfigService): TProviderOptions => ({
				client_id: config.getOrThrow<string>('YANDEX_CLIENT_ID'),
				client_secret: config.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
				scope: ['login:email', 'login:avatar', 'login:avatar']
			}),
			inject: [ConfigService]
		},
		{
			provide: OAUTH_PROVIDERS,
			useFactory: (google: GoogleProvider, yandex: YandexProvider) => [google, yandex],
			inject: [GoogleProvider, YandexProvider]
		},
		GoogleProvider,
		YandexProvider,
		ProvidersService
	],
	exports: [OAUTH_PROVIDERS, ProvidersService]
})
export class ProvidersModule { }