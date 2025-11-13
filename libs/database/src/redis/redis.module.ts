import { Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { REDIS_CLIENT } from './redis.constants'

@Module({
	imports: [ConfigModule.forRoot({
		envFilePath: '/.env'
	})],
	providers: [
		{
			provide: REDIS_CLIENT,
			useFactory: (config: ConfigService) => {
				const client = new Redis({
					host: config.getOrThrow<string>("REDIS_HOST"),
					port: config.getOrThrow<number>("REDIS_PORT"),
					password: config.getOrThrow<string>("REDIS_PASS"),
					maxRetriesPerRequest: 3,
					lazyConnect: true
				})

				const logger = new Logger(RedisModule.name)

				client.on('error', (err) => {
					logger.error(`Redis error: ${err}`)
				})

				client.on('connect', () => {
					logger.log(`Redis connected`)
				})

				client.on('ready', () => {
					logger.log('Redis ready')
				})

				return client

			},
			inject: [ConfigService]
		}
	],
	exports: [REDIS_CLIENT]
})
export class RedisModule { }
