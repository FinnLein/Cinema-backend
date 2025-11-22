import { generateSlug } from '@app/common/utils/generate-slug'
import { getValidDataBaseData } from '@app/common/utils/get-valid-data'
import { Actor } from '@app/contracts/actors/actor.dto'
import { CreateActorDto } from '@app/contracts/actors/create-actor.dto'
import { UpdateActorDto } from '@app/contracts/actors/update-actor.dto'
import { ACTORS_SERVICE } from '@app/database/knex/knex.module'
import { HttpStatus, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Knex } from 'knex'
import { InjectConnection } from 'nest-knexjs'

@Injectable()
export class ActorsService {
  private readonly tableName = 'actors'

  constructor(
    @InjectConnection(ACTORS_SERVICE) private readonly knex: Knex
  ) { }

  public async getAll(): Promise<Actor[]> {
    const actor = await this.knex(this.tableName).select('*')

    if (!actor) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'There is no actors yet' })

    return actor
  }

  public async getById(id: string): Promise<Actor> {
    const [actor] = await this.knex(this.tableName).where({ id })
    return actor
  }

  public async getBySlug(slug: string): Promise<Actor> {
    const [actor] = await this.knex(this.tableName).where({ slug })

    if (!actor) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Actor not found' })

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
      if (error.code === '23505') {
        throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: `Actor ${dto.name} already exists.` })
      }
      throw new RpcException({ statusCode: HttpStatus.BAD_GATEWAY, message: 'An unexpected error occurred.' })
    }
  }
  public async update(id: string, dto: UpdateActorDto) {
    const {slug, ...actors} = dto
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
      if (error.code === '23505') {
        throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: `Actor ${dto.name} already exists.` })
      }
      throw error
    }
  }
}
