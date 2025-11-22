import { CreateMovieDto } from '@app/contracts/movie/create-movie.dto'
import { FilterMovieDto } from '@app/contracts/movie/filter.dto'
import { MOVIES_PATTERNS } from '@app/contracts/movie/movies.patterns'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { MoviesService } from './movies.service'

@Controller()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @MessagePattern(MOVIES_PATTERNS.GET_ALL)
  public async getAll(@Payload() dto: FilterMovieDto) {
    return this.moviesService.getAll(dto)
  }

  @MessagePattern(MOVIES_PATTERNS.GET_BY_ID)
  public async getById(@Payload() id: string) {
    return this.moviesService.getById(id)
  }

  @MessagePattern(MOVIES_PATTERNS.GET_BY_SLUG)
  public async getBySlug(@Payload() slug: string) {
    return this.moviesService.getBySlug(slug)
  }
  @MessagePattern(MOVIES_PATTERNS.GET_BY_GENRE)
  public async getByGenre(@Payload() payload: { dto: FilterMovieDto, genre: string}) {
    return this.moviesService.getByGenre(payload.dto, payload.genre)
  }
  @MessagePattern(MOVIES_PATTERNS.GET_SIMILAR)
  public async getSimilar(@Payload() id: string) {
    return this.moviesService.getSimilar(id)
  }

  @MessagePattern(MOVIES_PATTERNS.CREATE)
  public async create(@Payload() dto: CreateMovieDto) {
    return await this.moviesService.create(dto)
  }

}
