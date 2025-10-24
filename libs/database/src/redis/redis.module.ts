import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { REDIS_CLIENT } from './redis.constants'

@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: REDIS_CLIENT,
			useFactory: (config: ConfigService) => {
				const client = new Redis({
					host: config.getOrThrow<string>('REDIS_HOST'),
					port: config.getOrThrow<number>('REDIS_PORT'),
					password: config.getOrThrow<string>('REDIS_PASS'),
					maxRetriesPerRequest: 3,
					lazyConnect: true
				})

				client.on('error', err => {
					console.error(`Failed connection due error: ${err.message}`)
				})

				client.on('success', () => {
					console.log('Successfully connected to Redis')
				})

				return client
			},
			inject: [ConfigService]
		}
	],
	exports: [REDIS_CLIENT]
})
export class RedisModule {

}