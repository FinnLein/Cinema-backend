import { GENRES_CLIENT } from '@app/common/client-config/clients.constants'
import { CreateGenreDto } from '@app/contracts/genres/create-genre.dto'
import { Genre } from '@app/contracts/genres/genre.dto'
import { GENRES_PATTERNS } from '@app/contracts/genres/genres.patterns'
import { UpdateGenreDto } from '@app/contracts/genres/update-genre.dto'

import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class GenresService {
	constructor(@Inject(GENRES_CLIENT) private readonly genresClient: ClientProxy) { }

	public async getAll() {
		return lastValueFrom(this.genresClient.send<Genre[]>(GENRES_PATTERNS.GET_ALL, {}))
	}
	public async getById(id: string) {
		return lastValueFrom(this.genresClient.send<Genre>(GENRES_PATTERNS.GET_BY_ID, id))
	}
	public async getBySlug(slug: string) {
		return lastValueFrom(this.genresClient.send<Genre>(GENRES_PATTERNS.GET_BY_SLUG, slug))
	}
	public async create(dto: CreateGenreDto) {
		return lastValueFrom(this.genresClient.send<Genre, CreateGenreDto>(GENRES_PATTERNS.CREATE, dto))
	}
	public async update(id: string, dto: UpdateGenreDto) {
		return lastValueFrom(this.genresClient.send<Genre, { id: string, dto: UpdateGenreDto }>(GENRES_PATTERNS.UPDATE, { id, dto }))
	}
}
