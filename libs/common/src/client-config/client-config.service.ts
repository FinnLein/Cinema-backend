import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientOptions, Transport } from '@nestjs/microservices'

@Injectable()
export class ClientConfigService {
	constructor(private readonly config: ConfigService) { }

	getClientOptions(
		port: string,
		host: string = 'REDIS_HOST',
		password: string = 'REDIS_PASS',
	): ClientOptions {
		return {
			transport: Transport.REDIS,
			options: {
				host: this.config.getOrThrow<string>(host),
				port: this.config.getOrThrow<number>(port),
				password: this.config.getOrThrow<string>(password),
			}
		}
	}

	get AuthClientOptions(): ClientOptions {
		return this.getClientOptions('AUTH_CLIENT_PORT')
	}
	get AccountsClientOptions(): ClientOptions {
		return this.getClientOptions('ACCOUNTS_CLIENT_PORT')
	}
	get ActorsClientOptions(): ClientOptions {
		return this.getClientOptions('ACTORS_CLIENT_PORT')
	}
	get EmailClientOptions(): ClientOptions {
		return this.getClientOptions('EMAIL_CLIENT_PORT')
	}
	get GenresClientOptions(): ClientOptions {
		return this.getClientOptions('GENRES_CLIENT_PORT')
	}
	get MoviesClientOptions(): ClientOptions {
		return this.getClientOptions('MOVIES_CLIENT_PORT')
	}
	get TokensClientOptions(): ClientOptions {
		return this.getClientOptions('TOKENS_CLIENT_PORT')
	}
	get UsersClientOptions(): ClientOptions {
		return this.getClientOptions('USERS_CLIENT_PORT')
	}
	get JwtTokensClientOptions(): ClientOptions {
		return this.getClientOptions('JWT_TOKENS_CLIENT_PORT')
	}
	get MediaClientOptions(): ClientOptions {
		return this.getClientOptions('MEDIA_CLIENT_PORT')
	}
}