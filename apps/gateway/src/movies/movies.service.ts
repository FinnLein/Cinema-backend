import { MOVIES_CLIENT } from '@app/common/client-config/clients.constants'
import { CreateMovieDto } from '@app/contracts/movie/create-movie.dto'
import { FilterMovieDto } from '@app/contracts/movie/filter.dto'
import { FullMovie, Movie } from '@app/contracts/movie/movie.dto'
import { MOVIES_MESSAGES_PATTERNS } from '@app/contracts/movie/movies.patterns'
import { UpdateMovieDto } from '@app/contracts/movie/update-movie.dto'
import { REDIS_CLIENT } from '@app/database/redis/redis.constants'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import Redis from 'ioredis'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class MoviesService {
	constructor(
		@Inject(MOVIES_CLIENT) private readonly moviesClient: ClientProxy,
		@Inject(REDIS_CLIENT) private readonly redis: Redis
	) { }

	public async getAll(dto: FilterMovieDto) {
		const cacheKey = 'movies:all'
		const cached = await this.redis.get(cacheKey)

		if (cached) {
			return JSON.parse(cached)
		}

		const movies = await lastValueFrom(this.moviesClient.send<FullMovie[]>(MOVIES_MESSAGES_PATTERNS.GET_ALL, dto))
		await this.redis.set(cacheKey, JSON.stringify(movies), 'EX', 60)

		return movies
	}
	public async getById(id: string) {
		return lastValueFrom(this.moviesClient.send<Movie>(MOVIES_MESSAGES_PATTERNS.GET_BY_ID, id))
	}
	public async getBySlug(slug: string) {
		return lastValueFrom(this.moviesClient.send<FullMovie>(MOVIES_MESSAGES_PATTERNS.GET_BY_SLUG, slug))
	}
	public async getByGenre(dto: FilterMovieDto, genre: string) {
		return lastValueFrom(this.moviesClient.send<FullMovie[]>(MOVIES_MESSAGES_PATTERNS.GET_BY_GENRE, { genre, dto }))
	}
	public async getByActor(dto: FilterMovieDto, actor: string) {
		return lastValueFrom(this.moviesClient.send<FullMovie[]>(MOVIES_MESSAGES_PATTERNS.GET_BY_ACTOR, { actor, dto }))
	}
	public async getSimilar(id: string) {
		return lastValueFrom(this.moviesClient.send<FullMovie[]>(MOVIES_MESSAGES_PATTERNS.GET_SIMILAR, id))
	}
	public async getMostPopular() {
		return lastValueFrom(this.moviesClient.send<FullMovie>(MOVIES_MESSAGES_PATTERNS.GET_MOST_POPULAR, {}))
	}
	public async create(dto: CreateMovieDto) {
		return lastValueFrom(this.moviesClient.send<FullMovie, CreateMovieDto>(MOVIES_MESSAGES_PATTERNS.CREATE, dto))
	}
	public async update(id: string, dto: UpdateMovieDto) {
		return lastValueFrom(this.moviesClient.send(MOVIES_MESSAGES_PATTERNS.UPDATE, { id, dto }))
	}
	public async delete(id: string) {
		return lastValueFrom(this.moviesClient.send(MOVIES_MESSAGES_PATTERNS.DELETE, id))
	}

}
