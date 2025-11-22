import { CreateGenreDto } from '@app/contracts/genres/create-genre.dto'
import { GENRES_PATTERNS } from '@app/contracts/genres/genres.patterns'
import { UpdateGenreDto } from '@app/contracts/genres/update-genre.dto'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { GenresService } from './genres.service'

@Controller()
export class GenresController {
  constructor(private readonly genresService: GenresService) { }

  @MessagePattern(GENRES_PATTERNS.GET_ALL)
  public async getAll() {
    return this.genresService.getAll()
  }
  @MessagePattern(GENRES_PATTERNS.GET_BY_ID)
  public async getById(@Payload() id: string) {
    return this.genresService.getById(id)
  }
  @MessagePattern(GENRES_PATTERNS.GET_BY_SLUG)
  public async getBySlug(@Payload() slug: string) {
    return this.genresService.getBySlug(slug)
  }
  @MessagePattern(GENRES_PATTERNS.CREATE)
  public async create(@Payload() dto: CreateGenreDto) {
    return this.genresService.create(dto)
  }
  @MessagePattern(GENRES_PATTERNS.UPDATE)
  public async update(@Payload() payload: { id: string, dto: UpdateGenreDto }) {
    return this.genresService.update(payload.id, payload.dto)
  }


}
