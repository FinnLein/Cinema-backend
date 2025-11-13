import { MicroserviceOptions, Transport } from '@nestjs/microservices'

export const microserviceOptions: MicroserviceOptions = {
	transport: Transport.REDIS,
	options: {
		host: process.env.REDIS_HOST,
		port: 6379,
		password: process.env.REDIS_PASS,
	}
}