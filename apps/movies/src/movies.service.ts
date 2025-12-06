import { ACTORS_CLIENT, GENRES_CLIENT } from '@app/common/client-config/clients.constants'
import { DB_ERROR_CODES } from '@app/common/constants/db-errors.constant'
import { generateSlug } from '@app/common/utils/generate-slug'
import { getValidDataBaseData } from '@app/common/utils/get-valid-data'
import { Actor } from '@app/contracts/actors/actor.dto'
import { ACTORS_PATTERNS } from '@app/contracts/actors/actors.patterns'
import { Genre } from '@app/contracts/genres/genre.dto'
import { GENRES_PATTERNS } from '@app/contracts/genres/genres.patterns'
import { CreateMovieDto } from '@app/contracts/movie/create-movie.dto'
import { FilterMovieDto, MovieSort } from '@app/contracts/movie/filter.dto'
import { FullMovie, Movie } from '@app/contracts/movie/movie.dto'
import { IPaginationResponse } from '@app/contracts/movie/pagination-response.interface'
import { UpdateMovieDto } from '@app/contracts/movie/update-movie.dto'
import { MOVIES_SERVICE } from '@app/database/knex/knex.module'
import { REDIS_CLIENT } from '@app/database/redis/redis.constants'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import Redis from 'ioredis'
import { Knex } from 'knex'
import { InjectConnection } from 'nest-knexjs'
import { lastValueFrom } from 'rxjs'
import { CommentsService } from './comments/comments.service'
import { RatingsService } from './ratings/ratings.service'
import { IJunctionTableInterface } from './types/junction-table.interface'
import { IResource } from './types/resource.interface'

@Injectable()
export class MoviesService {
	private readonly tableName = "movies"
	private readonly moviesGenres = "movies_genres"
	private readonly moviesActors = "movies_actors"

	constructor(
		@Inject(GENRES_CLIENT) private readonly genreClient: ClientProxy,
		@Inject(ACTORS_CLIENT) private readonly actorsClient: ClientProxy,
		@Inject(REDIS_CLIENT) private readonly redisClient: Redis,
		@InjectConnection(MOVIES_SERVICE) private readonly knex: Knex,
		private readonly commentsService: CommentsService,
		private readonly ratingsService: RatingsService
	) { }

	public async getAll(dto: FilterMovieDto = {}): Promise<IPaginationResponse<FullMovie>> {
		// const cacheKey = 'movies:all'

		// const cached = await this.redisClient.get(cacheKey)

		// if (cached) {
		// 	return JSON.parse(cached)
		// }

		const { query, limit, page } = await this.getFilteredMovies(dto)


		const movies: Movie[] = await query

		const totalCountResult = await this.knex(this.tableName)
			.countDistinct('id as count')
			.first()

		if (!totalCountResult) return null

		const totalCount = +totalCountResult.count as number

		const totalPages = Math.ceil(totalCount / +limit)

		const fullMovies = await this.getFullMovies(movies)

		const result = {
			data: fullMovies,
			meta: {
				totalCount,
				totalPages,
				currentPage: +page,
				limit: +limit
			}
		}

		// await this.redisClient.set(cacheKey, JSON.stringify(result), 'EX', 60)

		return result
	}

	public async getById(id: string): Promise<Movie> {
		const [movie] = await this.knex<Movie>(this.tableName).where({ id })

		if (!movie) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Movie not found.' })

		return movie
	}

	public async getFullMovie(id: string): Promise<FullMovie> {
		const movie = await this.getById(id)

		const genres = await this.getResource<Genre>({
			movieId: movie.id,
			tableName: this.moviesGenres,
			field: 'genre_id',
			client: this.genreClient,
			clientPattern: GENRES_PATTERNS.GET_BY_ID
		})
		const actors = await this.getResource<Actor>({
			movieId: movie.id,
			tableName: this.moviesActors,
			field: 'actor_id',
			client: this.actorsClient,
			clientPattern: ACTORS_PATTERNS.GET_BY_ID
		})

		const comments = await this.commentsService.getAll(movie.id)
		const rating = await this.ratingsService.get(movie.id)

		return { ...movie, genres, actors, comments, rating }
	}

	private async getFullMovies(movies: Movie[]): Promise<FullMovie[]> {
		return Promise.all(
			movies.map(async m => {
				const genres = await this.getResource<Genre>({
					movieId: m.id,
					tableName: this.moviesGenres,
					field: 'genre_id',
					client: this.genreClient,
					clientPattern: GENRES_PATTERNS.GET_BY_ID
				})
				const actors = await this.getResource<Actor>({
					movieId: m.id,
					tableName: this.moviesActors,
					field: 'actor_id',
					client: this.actorsClient,
					clientPattern: ACTORS_PATTERNS.GET_BY_ID
				})

				return { ...m, genres, actors }
			})
		)
	}

	public async getBySlug(slug: string): Promise<FullMovie> {
		const cacheKey = `movies:${slug}`
		const cached = await this.redisClient.get(cacheKey)

		if (cached) {
			return JSON.parse(cached)
		}

		const movie = await this.knex<Movie>(this.tableName).where({ slug }).first()

		if (!movie) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Movie not found.' })

		const fullMovie = await this.getFullMovie(movie.id)

		await this.redisClient.set(cacheKey, JSON.stringify(fullMovie), 'EX', 60)

		return fullMovie
	}

	public async getByGenre(genre: string, dto: FilterMovieDto = {}): Promise<IPaginationResponse<FullMovie>> {
		const cacheKey = `movies:byGenre:${genre}`
		const cached = await this.redisClient.get(cacheKey)

		if (cached) {
			return JSON.parse(cached)
		}

		const { query, page, limit } = await this.getFilteredMovies(dto)

		try {
			const existingGenre = await lastValueFrom(this.genreClient.send<Genre>(GENRES_PATTERNS.GET_BY_SLUG, generateSlug(genre)))

			const movieIds = await this.knex(this.moviesGenres).where({ genre_id: existingGenre.id }).select('movie_id')

			if (!movieIds.length) {
				throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Movies with this genre not found.' })
			}

			const movies: Movie[] = await query.whereIn('id', movieIds.map(m => m.movie_id))

			if (!movies.length) {
				throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Movies with this genre not found.' })
			}

			const totalCountResult = await this.knex(this.tableName)
				.whereIn('id', movies.map(m => m.id))
				.countDistinct('id as count')
				.first()

			const totalCount = +totalCountResult.count as number
			const totalPages = Math.ceil(totalCount / +limit)

			const fullMovies = await this.getFullMovies(movies)

			const result = {
				data: fullMovies,
				meta: {
					totalCount,
					totalPages,
					limit: +limit,
					currentPage: +page
				}
			}

			await this.redisClient.set(cacheKey, JSON.stringify(result), 'EX', 60)

			return result
		} catch (error) {
			throw new RpcException({ statusCode: error.statusCode, message: error.message })
		}
	}

	public async getByActor(actor: string, dto: FilterMovieDto = {}): Promise<IPaginationResponse<FullMovie>> {
		const cacheKey = `movies:byActor:${actor}`
		const cached = await this.redisClient.get(cacheKey)

		if (cached) {
			return JSON.parse(cached)
		}

		const { query, page = 1, limit = 12 } = await this.getFilteredMovies(dto)

		try {
			const existingActor = await lastValueFrom(this.actorsClient.send<Actor>(ACTORS_PATTERNS.GET_BY_SLUG, generateSlug(actor)))

			const movieIds = await this.knex(this.moviesActors).where({ actor_id: existingActor.id }).select('movie_id')

			const movies: Movie[] = await query.whereIn('id', movieIds.map(m => m.movie_id))

			if (!movies.length) {
				throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Movies with this actor not found.' })
			}

			const totalCountResult = await this.knex(this.tableName)
				.whereIn('id', movies.map(m => m.id))
				.countDistinct('id as count')
				.first()

			const totalCount = +totalCountResult.count as number
			const totalPages = Math.ceil(totalCount / +limit)

			const fullMovies = await this.getFullMovies(movies)

			const result = {
				data: fullMovies,
				meta: {
					totalCount,
					totalPages,
					limit: +limit,
					currentPage: +page
				}
			}

			await this.redisClient.set(cacheKey, JSON.stringify(result), 'EX', 60)

			return result
		} catch (error) {
			throw new RpcException({ statusCode: error.statusCode, message: error.message })

		}
	}

	public async getSimilar(id: string) {
		const movie = await this.getFullMovie(id)

		const genreIds = movie.genres.map(g => g.id)
		const movieIds = await this.knex(this.moviesGenres)
			.whereIn('genre_id', genreIds)
			.select('movie_id')
			.whereNot('movie_id', id)

		const similarMoviesPromise = movieIds.map(m => this.getById(m.movie_id))
		const similarMovies = await Promise.all(similarMoviesPromise)

		return similarMovies
	}

	public async getMostPopular() {
		const maxCount = this.knex(this.tableName).max('count_opened').first()
		const movie = this.knex(this.tableName).where('count_opened', maxCount).first()

		return movie
	}

	public async create(dto: CreateMovieDto): Promise<FullMovie> {
		const { actors, genres, slug, ...movies } = dto
		const movieData = getValidDataBaseData(movies)

		const validGenres = await this.getValidResources<Genre>(
			genres,
			{
				client: this.genreClient,
				clientPattern: GENRES_PATTERNS.GET_BY_SLUG
			}
		)
		const validActors = await this.getValidResources<Actor>(
			actors,
			{
				client: this.actorsClient,
				clientPattern: ACTORS_PATTERNS.GET_BY_SLUG
			}
		)

		return this.knex.transaction(async trx => {
			try {
				const [movie] = await trx<Movie>(this.tableName)
					.insert({
						slug: generateSlug(movies.title),
						...movieData
					})
					.returning('*')

				await this.createJunctionTable({
					trx,
					tableName: this.moviesGenres,
					relationField: 'genre_id',
					relations: validGenres,
					movieId: movie.id
				})
				await this.createJunctionTable({
					trx,
					tableName: this.moviesActors,
					relationField: 'actor_id',
					relations: validActors,
					movieId: movie.id
				})

				return {
					...movie,
					genres: validGenres,
					actors: validActors
				}
			} catch (error) {
				if (error.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
					throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: `Movie title ${dto.title} already exists.` })
				}
			}
		})

	}

	public async update(id: string, dto: UpdateMovieDto): Promise<FullMovie> {
		const { slug, genres, actors, ...movies } = dto

		const movieData = getValidDataBaseData(movies)
		const validGenres = await this.getValidResources<Genre>(
			genres,
			{
				client: this.genreClient,
				clientPattern: GENRES_PATTERNS.GET_BY_SLUG
			}
		)
		const validActors = await this.getValidResources<Actor>(
			genres,
			{
				client: this.actorsClient,
				clientPattern: ACTORS_PATTERNS.GET_BY_SLUG
			}
		)

		return this.knex.transaction(async trx => {
			try {
				const [movie] = await trx<Movie>(this.tableName)
					.where({ id })
					.update({
						slug: generateSlug(dto?.title),
						...movieData
					})
					.returning('*')

				if (!movie) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Movie not found' })

				await this.updateJunctionTable({
					trx,
					tableName: this.moviesGenres,
					relations: validGenres,
					movieId: movie.id,
					relationField: 'genre_id'
				})

				await this.updateJunctionTable({
					trx,
					tableName: this.moviesActors,
					relations: validActors,
					movieId: movie.id,
					relationField: 'actor_id'
				})

				return {
					...movie,
					genres: validGenres,
					actors: validActors
				}
			} catch (error) {
				throw error
			}
		})

	}

	public async delete(id: string) {
		const movie = await this.getById(id)

		await this.knex.transaction(async trx => {
			await trx(this.tableName)
				.where({ id })
				.del()

			await trx(this.moviesActors)
				.where('movie_id', id)
				.del()

			await trx(this.moviesGenres)
				.where('movie_id', id)
				.del()
		})

		return { message: `Movie ${movie.title} deleted` }
	}

	// Filters

	private async getFilteredMovies(dto: FilterMovieDto = {}) {
		const { page = 1, limit = 12, searchTerm, sort, genres, rating } = dto
		const offset = (+page - 1) * +limit

		const query = this.knex(this.tableName)
			.select('*')
			.limit(+limit)
			.offset(offset)
			.returning('*')

		if (searchTerm) await this.getSearchTerm(searchTerm, query)

		if (genres) await this.getGenresFilter(genres, query)

		if (rating) await this.getRatingFilter(rating, query)

		await this.getSortFilter(sort, query)

		return {
			query,
			limit,
			page
		}
	}
	private async getSortFilter(sort: MovieSort, query: Knex.QueryBuilder) {
		switch (sort) {
			case 'OLDEST': query.orderBy('created_at', 'asc')
			case 'NEWEST': query.orderBy('created_at', 'desc')
			case 'MOST_POPULAR': query.orderBy('count_opened', 'desc')
			case 'LESS_POPULAR': query.orderBy('count_opened', 'asc')
			default: query.orderBy([
				{ column: 'count_opened', order: 'desc' },
				{ column: 'created_at', order: 'desc' },
			])
		}
	}
	private async getSearchTerm(searchTerm: string, query: Knex.QueryBuilder) {
		query.whereRaw('title ILIKE ?', [`%${searchTerm}%`])
	}
	private async getGenresFilter(genres: string, query: Knex.QueryBuilder) {
		const genreArray = genres.split('|').map(g => g.trim())

		const genresIds = await this.knex(this.moviesGenres).whereIn('genre_id', genreArray).select('movie_id')

		if (genresIds.length > 0) {
			const moviesIds = genresIds.map(g => g.movie_id)
			query.whereIn('id', moviesIds)
		}
	}
	private async getRatingFilter(rating: string, query: Knex.QueryBuilder) {
		const ratings = rating.split('|').map(r => +r)
		query.whereIn('rating', ratings)
	}

	// Create junction tables 

	private async createJunctionTable(dto: IJunctionTableInterface) {
		const { trx, tableName, relationField, relations, movieId } = dto
		return Promise.all(relations.map(async r => await trx(tableName).insert({
			movie_id: movieId,
			[relationField]: r.id
		})))
	}

	// Update junction tables

	private async updateJunctionTable(dto: IJunctionTableInterface) {
		const { trx, tableName, movieId } = dto
		await trx(tableName)
			.where('movie_id', movieId)
			.del()

		await this.createJunctionTable(dto)
	}

	// Get actors, users and etc.

	private async getResource<T>(dto: IResource) {
		const { tableName, movieId, field, client, clientPattern } = dto
		const resourceIds = await this.knex(tableName).where({ movie_id: movieId }).select(field)

		const resourcePromise = resourceIds.map(r => {
			const ids = Object.values(r)

			for (const id of ids) {
				return lastValueFrom(client.send<T>(clientPattern, id))
			}
		})
		const resource = await Promise.all(resourcePromise)

		return resource
	}

	// Get valid actors, users and etc.

	private async getValidResources<T>(resource: T[], dto: IResource) {
		const { client, clientPattern } = dto

		const validResourcePromise = resource.map(r => {
			const slugs = Object.values(r)

			for (const slug of slugs) {
				return lastValueFrom(client.send<T>(clientPattern, generateSlug(slug)))
			}
		})

		const validResource = await Promise.all(validResourcePromise)

		return validResource
	}

	// Handle events

	public async handleActorDeleted(id: string) {
		return this.handleResourceDeleted(id, {
			tableName: this.moviesActors,
			field: 'actor_id'
		})
	}
	public async handleGenreDeleted(id: string) {
		return this.handleResourceDeleted(id, {
			tableName: this.moviesGenres,
			field: 'genre_id'
		})
	}

	private async handleResourceDeleted(id: string, dto: Pick<IResource, 'tableName' | 'field'>) {
		const { tableName, field } = dto
		const moviesIds = await this.knex(tableName)
			.where(field, id)
			.select('movie_id')

		const promise = moviesIds.map(m => this.delete(m.movie_id))
		return Promise.all(promise)
	}
}