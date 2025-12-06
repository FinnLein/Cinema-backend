import { ACTORS_PATTERNS } from '@app/contracts/actors/actors.patterns'
import { CreateActorDto } from '@app/contracts/actors/create-actor.dto'
import { UpdateActorDto } from '@app/contracts/actors/update-actor.dto'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ActorsService } from './actors.service'

@Controller()
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) { }
  @MessagePattern(ACTORS_PATTERNS.GET_ALL)
  public async getAll() {
    return this.actorsService.getAll()
  }
  @MessagePattern(ACTORS_PATTERNS.GET_BY_ID)
  public async getById(@Payload() id: string) {
    return this.actorsService.getById(id)
  }
  @MessagePattern(ACTORS_PATTERNS.GET_BY_SLUG)
  public async getBySlug(@Payload() slug: string) {
    return this.actorsService.getBySlug(slug)
  }
  @MessagePattern(ACTORS_PATTERNS.CREATE)
  public async create(@Payload() dto: CreateActorDto) {
    return this.actorsService.create(dto)
  }
  @MessagePattern(ACTORS_PATTERNS.UPDATE)
  public async update(@Payload() payload: { id: string, dto: UpdateActorDto }) {
    return this.actorsService.update(payload.id, payload.dto)
  }
  @MessagePattern(ACTORS_PATTERNS.DELETE)
  public async delete(@Payload() id: string) {
    return this.actorsService.delete(id)
  }

}
