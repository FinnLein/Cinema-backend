import { MOVIES_CLIENT } from '@app/common/client-config/clients.constants'
import { DB_ERROR_CODES } from '@app/common/constants/db-errors.constant'
import { generateSlug } from '@app/common/utils/generate-slug'
import { getValidDataBaseData } from '@app/common/utils/get-valid-data'
import { CreateGenreDto } from '@app/contracts/genres/create-genre.dto'
import { Genre } from '@app/contracts/genres/genre.dto'
import { UpdateGenreDto } from '@app/contracts/genres/update-genre.dto'
import { MOVIES_EVENTS_PATTERNS } from '@app/contracts/movie/movies.patterns'
import { GENRES_SERVICE } from '@app/database/knex/knex.module'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { Knex } from 'knex'
import { InjectConnection } from 'nest-knexjs'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class GenresService {
  private readonly tableName = 'genres'

  constructor(
    @InjectConnection(GENRES_SERVICE) private readonly knex: Knex,
    @Inject(MOVIES_CLIENT) private readonly moviesClient: ClientProxy
  ) { }

  public async getAll(): Promise<Genre[]> {
    const genre = await this.knex(this.tableName).select('*')

    if (!genre) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'There is no genres yet' })

    return genre
  }

  public async getById(id: string): Promise<Genre> {
    const [genre] = await this.knex(this.tableName).where({ id })

    if (!genre) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Genre not found.' })

    return genre
  }

  public async getBySlug(slug: string): Promise<Genre> {
    const [genre] = await this.knex<Genre>(this.tableName).where({ slug })

    if (!genre) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Genre not found.' })


    return genre
  }

  public async create(dto: CreateGenreDto) {
    const { slug, ...genres } = dto
    const data = getValidDataBaseData(genres)

    try {
      const [genre] = await this.knex(this.tableName)
        .insert({
          slug: generateSlug(dto.name),
          ...data
        })
        .returning('*')

      return genre
    } catch (error) {
      if (error.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: `Genre title ${dto.name} already exists.` })
      }
      throw new RpcException({ statusCode: HttpStatus.BAD_GATEWAY, message: 'An unexpected error occurred.' })
    }
  }

  public async update(id: string, dto: UpdateGenreDto) {
    const { slug, ...genres } = dto
    const data = getValidDataBaseData(genres)

    try {
      const [genre] = await this.knex(this.tableName)
        .where({ id })
        .update({
          slug: generateSlug(dto.name),
          ...data
        })
        .returning('*')

      return genre
    } catch (error) {
      if (error.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: `Genre title ${dto.name} already exists.` })
      }
      throw error
    }
  }

  public async delete(id: string) {
    await this.getById(id)

    await this.knex(this.tableName)
      .where({ id })
      .del()

    await lastValueFrom(this.moviesClient.emit(MOVIES_EVENTS_PATTERNS.GENRE_DELETED, id))

    return {message: `Genre ${id} deleted successfully.`}
  }
}
