import { CreateMovieDto } from '@app/contracts/movie/create-movie.dto'
import { FilterMovieDto } from '@app/contracts/movie/filter.dto'
import { MOVIES_EVENTS_PATTERNS, MOVIES_MESSAGES_PATTERNS } from '@app/contracts/movie/movies.patterns'
import { UpdateMovieDto } from '@app/contracts/movie/update-movie.dto'
import { Controller } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { MoviesService } from './movies.service'

@Controller()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @MessagePattern(MOVIES_MESSAGES_PATTERNS.GET_ALL)
  public async getAll(@Payload() dto: FilterMovieDto) {
    return this.moviesService.getAll(dto)
  }

  @MessagePattern(MOVIES_MESSAGES_PATTERNS.GET_BY_ID)
  public async getById(@Payload() id: string) {
    return this.moviesService.getFullMovie(id)
  }

  @MessagePattern(MOVIES_MESSAGES_PATTERNS.GET_BY_SLUG)
  public async getBySlug(@Payload() slug: string) {
    return this.moviesService.getBySlug(slug)
  }
  @MessagePattern(MOVIES_MESSAGES_PATTERNS.GET_BY_GENRE)
  public async getByGenre(@Payload() payload: { genre: string, dto: FilterMovieDto }) {
    return this.moviesService.getByGenre(payload.genre, payload.dto)
  }
  @MessagePattern(MOVIES_MESSAGES_PATTERNS.GET_BY_ACTOR)
  public async getByActor(@Payload() payload: { actor: string, dto: FilterMovieDto }) {
    return this.moviesService.getByActor(payload.actor, payload.dto)
  }
  @MessagePattern(MOVIES_MESSAGES_PATTERNS.GET_SIMILAR)
  public async getSimilar(@Payload() id: string) {
    return this.moviesService.getSimilar(id)
  }
  @MessagePattern(MOVIES_MESSAGES_PATTERNS.GET_MOST_POPULAR)
  public async getMostPopular() {
    return this.moviesService.getMostPopular()
  }
  @MessagePattern(MOVIES_MESSAGES_PATTERNS.CREATE)
  public async create(@Payload() dto: CreateMovieDto) {
    return this.moviesService.create(dto)
  }
  @MessagePattern(MOVIES_MESSAGES_PATTERNS.UPDATE)
  public async update(@Payload() payload: { id: string, dto: UpdateMovieDto }) {
    return this.moviesService.update(payload.id, payload.dto)
  }
  @MessagePattern(MOVIES_MESSAGES_PATTERNS.DELETE)
  public async delete(@Payload() id: string) {
    return this.moviesService.delete(id)
  }

  // Events

  @EventPattern(MOVIES_EVENTS_PATTERNS.ACTOR_DELETED)
  public async onActorDeleted(@Payload() id: string) {
    return this.moviesService.handleActorDeleted(id)
  }
  @EventPattern(MOVIES_EVENTS_PATTERNS.GENRE_DELETED)
  public async onGenreDeleted(@Payload() id: string) {
    return this.moviesService.handleGenreDeleted(id)
  }
}
