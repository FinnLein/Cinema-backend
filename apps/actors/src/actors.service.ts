import { MOVIES_CLIENT } from '@app/common/client-config/clients.constants'
import { DB_ERROR_CODES } from '@app/common/constants/db-errors.constant'
import { generateSlug } from '@app/common/utils/generate-slug'
import { getValidDataBaseData } from '@app/common/utils/get-valid-data'
import { Actor } from '@app/contracts/actors/actor.dto'
import { CreateActorDto } from '@app/contracts/actors/create-actor.dto'
import { UpdateActorDto } from '@app/contracts/actors/update-actor.dto'
import { MOVIES_EVENTS_PATTERNS } from '@app/contracts/movie/movies.patterns'
import { ACTORS_SERVICE } from '@app/database/knex/knex.module'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { Knex } from 'knex'
import { InjectConnection } from 'nest-knexjs'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class ActorsService {
  private readonly tableName = 'actors'

  constructor(
    @Inject(MOVIES_CLIENT) private readonly moviesClient: ClientProxy,
    @InjectConnection(ACTORS_SERVICE) private readonly knex: Knex,
  ) { }

  public async getAll(): Promise<Actor[]> {
    const actor = await this.knex(this.tableName).select('*')

    if (!actor) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'There is no actors yet' })

    return actor
  }

  public async getById(id: string): Promise<Actor> {
    const actor = await this.knex<Actor>(this.tableName).where({ id }).first()

    if (!actor) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Actor not found' })

    return actor
  }

  public async getBySlug(slug: string): Promise<Actor> {
    const actor = await this.knex<Actor>(this.tableName).where({ slug }).first()

    if (!actor) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Actor not found.' })

    return actor
  }

  public async create(dto: CreateActorDto) {
    const { slug, ...actors } = dto
    const data = getValidDataBaseData(actors)

    try {
      const [actor] = await this.knex(this.tableName)
        .insert({
          slug: generateSlug(dto.name),
          ...data
        })
        .returning('*')
      return actor
    } catch (error) {
      if (error.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: `Actor ${dto.name} already exists.` })
      }
      throw new RpcException({ statusCode: HttpStatus.BAD_GATEWAY, message: 'An unexpected error occurred.' })
    }
  }
  public async update(id: string, dto: UpdateActorDto) {
    const { slug, ...actors } = dto
    const data = getValidDataBaseData(actors)

    try {
      const [actor] = await this.knex(this.tableName)
        .where({ id })
        .update({
          slug: generateSlug(dto.name),
          ...data
        })
        .returning('*')

      return actor
    } catch (error) {
      if (error.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: `Actor ${dto.name} already exists.` })
      }
      throw error
    }
  }
  public async delete(id: string) {
    const actor = await this.knex<Actor>(this.tableName)
      .where({ id })
      .first()

    if (!actor) {
      throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: "Actor not found." })
    }

    await this.knex(this.tableName)
      .where({ id })
      .del()

    await lastValueFrom(this.moviesClient.emit(MOVIES_EVENTS_PATTERNS.ACTOR_DELETED, id))

    return { message: `Actor ${id} deleted successfully.` }
  }
}
