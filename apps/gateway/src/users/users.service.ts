import { USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { CreateUserDto } from '@app/contracts/users/create-user.dto'
import { UpdateUserDto } from '@app/contracts/users/update-user.dto'
import { User } from '@app/contracts/users/user.dto'
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
		return lastValueFrom(this.usersClient.send<User[]>(USERS_PATTERNS.GET_ALL, {}))
	}

	public async getProfile(id: string){
		return lastValueFrom(this.usersClient.send<User>(USERS_PATTERNS.GET_BY_ID, id))
	}

	public async updateProfile(id: string, dto: UpdateUserDto){
		return lastValueFrom(this.usersClient.send<User>(USERS_PATTERNS.UPDATE_PROFILE, {id, dto}))
	}

	public async create(dto: CreateUserDto) {
		return lastValueFrom(
			this.usersClient.send<User>(USERS_PATTERNS.CREATE, dto)
		)
	}
}
