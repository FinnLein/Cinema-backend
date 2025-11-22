import { ACTORS_CLIENT, GENRES_CLIENT } from '@app/common/client-config/clients.constants'
import { generateSlug } from '@app/common/utils/generate-slug'
import { getValidDataBaseData } from '@app/common/utils/get-valid-data'
import { Actor } from '@app/contracts/actors/actor.dto'
import { ACTORS_PATTERNS } from '@app/contracts/actors/actors.patterns'
import { Genre } from '@app/contracts/genres/genre.dto'
import { GENRES_PATTERNS } from '@app/contracts/genres/genres.patterns'
import { CreateMovieDto } from '@app/contracts/movie/create-movie.dto'
import { FilterMovieDto, MovieSort } from '@app/contracts/movie/filter.dto'
import { Movie } from '@app/contracts/movie/movie.dto'
import { IPaginationResponse } from '@app/contracts/movie/pagination-response.interface'
import { UpdateMovieDto } from '@app/contracts/movie/update-movie.dto'
import { MOVIES_SERVICE } from '@app/database/knex/knex.module'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { Knex } from 'knex'
import { InjectConnection } from 'nest-knexjs'
import { EmptyError, lastValueFrom } from 'rxjs'
import { FullMovie } from './../../../libs/contracts/src/movie/movie.dto'

@Injectable()
export class MoviesService {
	private readonly tableName = "movies"
	private readonly moviesGenres = "movies_genres"
	private readonly moviesActors = "movies_actors"

	constructor(
		@Inject(GENRES_CLIENT) private readonly genreClient: ClientProxy,
		@Inject(ACTORS_CLIENT) private readonly actorsClient: ClientProxy,
		@InjectConnection(MOVIES_SERVICE) private readonly knex: Knex,
	) { }

	public async getAll(dto: FilterMovieDto = {}): Promise<IPaginationResponse<FullMovie>> {
		const { query, limit = 12, page = 1 } = await this.getFilteredMovies(dto)

		const movies: Movie[] = await query

		const totalCountResult = await this.knex(this.tableName)
			.countDistinct('id as count')
			.first()

		if (!totalCountResult) return null

		const totalCount = +totalCountResult.count as number

		const totalPages = Math.ceil(totalCount / +limit)

		const fullMovies = await this.getFullMovies(movies)

		return {
			data: fullMovies,
			meta: {
				totalCount,
				totalPages,
				currentPage: +page,
				limit: +limit
			}
		}
	}

	public async getById(id: string): Promise<FullMovie> {
		const [movie] = await this.knex<Movie>(this.tableName).where({ id })

		const fullMovie = await this.getFullMovie(movie)
		return fullMovie
	}

	public async getBySlug(slug: string): Promise<FullMovie> {
		const [movie] = await this.knex<Movie>(this.tableName).where({ slug })

		if (!movie) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Movie not found.' })

		const fullMovie = await this.getFullMovie(movie)
		return fullMovie
	}

	public async getByGenre(dto: FilterMovieDto = {}, genre: string): Promise<IPaginationResponse<FullMovie>> {
		const { query, page = 1, limit = 12 } = await this.getFilteredMovies(dto)

		try {
			const existingGenre = await lastValueFrom(this.genreClient.send<Genre>(GENRES_PATTERNS.GET_BY_SLUG, generateSlug(genre)))

			if (!existingGenre) {
				throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Genre not found.' })
			}

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
			return {
				data: fullMovies,
				meta: {
					totalCount,
					totalPages,
					limit: +limit,
					currentPage: +page
				}
			}
		} catch (error) {
			if (error instanceof EmptyError) {
				console.error('No elements in sequence error:', error.message)
				throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Genre not found.' })
			}
			throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: "An unexpected error occurred." })
		}

	}

	public async getSimilar(id: string) {
		const movie = await this.getById(id)

		const genreIds = movie.genres.map(g => g.id)
		const movieIds = await this.knex(this.moviesGenres)
			.whereIn('genre_id', genreIds)
			.select('movie_id')
			.whereNot('movie_id', id)

		const similarMoviesPromise = movieIds.map(m => this.getById(m.movie_id))
		const similarMovies = await Promise.all(similarMoviesPromise)

		return similarMovies
	}

	public async create(dto: CreateMovieDto): Promise<FullMovie> {
		const { actors, genres, slug, ...movies } = dto
		const movieData = getValidDataBaseData(movies)

		const validGenres = await this.getValidGenres(genres)
		const validActors = await this.getValidActors(actors)

		try {
			const [movie] = await this.knex(this.tableName)
				.insert({
					slug: generateSlug(movies.title),
					...movieData
				})
				.returning('*')

			const genresToInsert = validGenres.map(g => ({
				movie_id: movie.id,
				genre_id: g.id
			}))
			const actorsToInsert = validActors.map(a => ({
				movie_id: movie.id,
				actor_id: a.id
			}))

			await this.knex(this.moviesGenres).insert(genresToInsert)
			await this.knex(this.moviesActors).insert(actorsToInsert)

			return {
				...movie,
				validGenres,
				validActors
			}
		} catch (error) {
			if (error.code === '23505') {
				throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: `Movie title ${dto.title} already exists.` })
			}
			throw error
		}
	}

	public async update(id: string, dto: UpdateMovieDto): Promise<Movie> {
		const { slug, ...movies } = dto

		const data = getValidDataBaseData(movies)
		try {
			const [movie] = await this.knex<Movie>(this.tableName)
				.where({ id })
				.update({
					slug: generateSlug(dto.title),
					...data
				})
				.returning('*')
			return movie
		} catch (error) {
			if (error.code === '23505') {
				throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: `Movie title ${dto.title} already exists.` })
			}
			throw new RpcException({ statusCode: HttpStatus.BAD_GATEWAY, message: 'An unexpected error occurred.' })
		}
	}

	private async getValidGenres(genres: Genre[]) {
		const validGenresPromise = genres.map(g => lastValueFrom(this.genreClient.send<Genre>(GENRES_PATTERNS.GET_BY_SLUG, generateSlug(g.name)))
		)
		const validGenres = await Promise.all(validGenresPromise)

		if (!validGenres.length) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Genres not found.' })

		return validGenres
	}
	private async getValidActors(actors: Actor[]) {
		const validActorsPromise = actors.map(a => lastValueFrom(this.actorsClient.send<Actor>(ACTORS_PATTERNS.GET_BY_SLUG, generateSlug(a.name))))

		const validActors = await Promise.all(validActorsPromise)

		if (!validActors.length) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Actors not found.' })

		return validActors
	}
	private async getFilteredMovies(dto: FilterMovieDto = {}) {
		const { page, limit, searchTerm, sort, genres, rating } = dto
		const offset = (+page - 1) * +limit

		const query = this.knex(this.tableName)
			.select('*')
			.limit(+limit)
			.offset(offset)
			.returning('*')

		if (searchTerm) await this.getSearchTerm(searchTerm, query)

		if (sort) await this.getSortFilter(sort, query)

		if (genres) await this.getGenresFilter(genres, query)

		if (rating) await this.getRatingFilter(rating, query)

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
			default: query.orderBy('created_at', 'desc')
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
	private async getFullMovies(movies: Movie[]): Promise<FullMovie[]> {
		return Promise.all(
			movies.map(async m => {
				const genres = await this.getGenres(m.id)
				const actors = await this.getActors(m.id)
				return { ...m, genres, actors }
			})
		)
	}
	private async getFullMovie(movie: Movie): Promise<FullMovie> {
		const genres = await this.getGenres(movie.id)
		const actors = await this.getActors(movie.id)
		return { ...movie, genres, actors }
	}
	private async getGenres(id: string) {
		const genresIds = await this.knex(this.moviesGenres).where({ movie_id: id }).select('genre_id')

		const genresPromise = genresIds.map(g => {
			return lastValueFrom(this.genreClient.send<Genre>(GENRES_PATTERNS.GET_BY_ID, g.genre_id))
		})

		const genres = await Promise.all(genresPromise)

		return genres
	}
	private async getActors(id: string) {
		const actorsIds = await this.knex(this.moviesActors).where({ movie_id: id }).select('actor_id')

		const actorsPromise = actorsIds.map(g => {
			return lastValueFrom(this.genreClient.send<Actor>(ACTORS_PATTERNS.GET_BY_ID, g.actor_id))
		})
		const actors = await Promise.all(actorsPromise)

		return actors
	}
}