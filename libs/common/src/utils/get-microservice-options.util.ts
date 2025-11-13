import { ConfigService } from '@nestjs/config'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import * as dotenv from 'dotenv'

dotenv.config()

export function getMicroserviceOptions(config: ConfigService): MicroserviceOptions {
	return {
		transport: Transport.REDIS,
		options: {
			host: config.getOrThrow<string>("REDIS_HOST"),
			port: config.getOrThrow<number>("REDIS_PORT"),
			password: config.getOrThrow<string>("REDIS_PASS")
		}
	}
}