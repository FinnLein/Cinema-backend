import { USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { CreateUserDto } from '@app/contracts/users/create-user.dto'
import { UserDto } from '@app/contracts/users/user.dto'
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class UsersService {
	constructor(
		@Inject(USERS_CLIENT) private readonly usersClient: ClientProxy
	) { }

	public async getAll() {
		return lastValueFrom(this.usersClient.send<UserDto[]>(USERS_PATTERNS.GET_ALL, {}))
	}
	public async create(dto: CreateUserDto) {
		return lastValueFrom(
			this.usersClient.send<UserDto>(USERS_PATTERNS.CREATE, dto)
		)
	}
}
