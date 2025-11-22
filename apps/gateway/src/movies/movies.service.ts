import { MOVIES_CLIENT } from '@app/common/client-config/clients.constants'
import { CreateMovieDto } from '@app/contracts/movie/create-movie.dto'
import { FilterMovieDto } from '@app/contracts/movie/filter.dto'
import { FullMovie, Movie } from '@app/contracts/movie/movie.dto'
import { MOVIES_PATTERNS } from '@app/contracts/movie/movies.patterns'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class MoviesService {
	constructor(
		@Inject(MOVIES_CLIENT) private readonly moviesClient: ClientProxy
	) { }

	public async getAll(dto: FilterMovieDto) {
		return lastValueFrom(this.moviesClient.send<FullMovie[]>(MOVIES_PATTERNS.GET_ALL, dto))
	}
	public async getById(id: string) {
		return lastValueFrom(this.moviesClient.send<Movie>(MOVIES_PATTERNS.GET_BY_ID, id))
	}
	public async getBySlug(slug: string) {
		return lastValueFrom(this.moviesClient.send<FullMovie>(MOVIES_PATTERNS.GET_BY_SLUG, slug))
	}
	public async getByGenre(dto: FilterMovieDto, genre: string) {
		return lastValueFrom(this.moviesClient.send<FullMovie[]>(MOVIES_PATTERNS.GET_BY_GENRE, {dto, genre}))
	}
	public async getSimilar(id: string) {
		return lastValueFrom(this.moviesClient.send<FullMovie[]>(MOVIES_PATTERNS.GET_SIMILAR, id))
	}
	public async create(dto: CreateMovieDto) {
		return lastValueFrom(this.moviesClient.send<FullMovie, CreateMovieDto>(MOVIES_PATTERNS.CREATE, dto))
	}
}
