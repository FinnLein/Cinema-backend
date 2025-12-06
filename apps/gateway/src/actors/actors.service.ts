import { ACTORS_CLIENT } from '@app/common/client-config/clients.constants'
import { Actor } from '@app/contracts/actors/actor.dto'
import { ACTORS_PATTERNS } from '@app/contracts/actors/actors.patterns'
import { CreateActorDto } from '@app/contracts/actors/create-actor.dto'
import { UpdateActorDto } from '@app/contracts/actors/update-actor.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class ActorsService {
	constructor(
		@Inject(ACTORS_CLIENT) private readonly genresClient: ClientProxy,
	) { }

	public async getAll() {
		return lastValueFrom(this.genresClient.send<Actor[]>(ACTORS_PATTERNS.GET_ALL, {}))
	}
	public async getById(id: string) {
		return lastValueFrom(this.genresClient.send<Actor>(ACTORS_PATTERNS.GET_BY_ID, id))
	}
	public async getBySlug(slug: string) {
		try {
			return lastValueFrom(this.genresClient.send<Actor>(ACTORS_PATTERNS.GET_BY_SLUG, slug))
		} catch (error) {
			throw error
		}
	}
	public async create(dto: CreateActorDto) {
		return lastValueFrom(this.genresClient.send<Actor, CreateActorDto>(ACTORS_PATTERNS.CREATE, dto))
	}
	public async update(id: string, dto: UpdateActorDto) {
		return lastValueFrom(this.genresClient.send<Actor, { id: string, dto: UpdateActorDto }>(ACTORS_PATTERNS.UPDATE, { id, dto }))
	}
	public async delete(id: string) {
		return lastValueFrom(this.genresClient.send(ACTORS_PATTERNS.DELETE, id))
	}

}
