import { USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { UserDto } from '@app/contracts/users/user.dto'
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns'
import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { lastValueFrom } from 'rxjs'

export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
		private readonly config: ConfigService
	) {
		super({
			secretOrKey: config.getOrThrow("JWT_SECRET"),
			ignoreExpiration: false,  
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		})
	}

	async validate({ id }: Pick<UserDto, 'id'>) {
		return lastValueFrom(this.usersClient.send(USERS_PATTERNS.GET_BY_ID, id))
	}
}