import { ConfigService } from '@nestjs/config'

interface IDatabaseOptions {
	host: string,
	port: number,
	user: string,
	password: string,
	database: string
}

export function getDatabaseOptions(config: ConfigService, serviceName: string): IDatabaseOptions {
	return {
		host: config.getOrThrow<string>('POSTGRES_HOST'),
		user: config.getOrThrow<string>('POSTGRES_USER'),
		password: config.getOrThrow<string>('POSTGRES_PASSWORD'),
		port: config.getOrThrow<number>(`${serviceName.toUpperCase()}_DATABASE_PORT`),
		database: config.getOrThrow<string>(`${serviceName.toUpperCase()}_DATABASE_NAME`),
	}
}