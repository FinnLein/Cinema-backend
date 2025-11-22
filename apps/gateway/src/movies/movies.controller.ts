import { CreateMovieDto } from '@app/contracts/movie/create-movie.dto'
import { FilterMovieDto } from '@app/contracts/movie/filter.dto'
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common'
import { MoviesService } from './movies.service'

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(@Query() dto: FilterMovieDto) {
    return this.moviesService.getAll(dto)
  }

  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  public async getById(@Param('id') id: string) {
    return this.moviesService.getById(id)
  }
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  public async getBySlug(@Param('slug') slug: string) {
    return this.moviesService.getBySlug(slug)
  }
  @Get('by-genre/:genre')
  @HttpCode(HttpStatus.OK)
  public async getByGenre(
    @Query() dto: FilterMovieDto, 
    @Param('genre') genre: string
  ) {
    return this.moviesService.getByGenre(dto, genre)
  }

  @Get('similar/:id')
  @HttpCode(HttpStatus.OK)
  public async getSimilar(
    @Param('id') id: string
  ) {
    return this.moviesService.getSimilar(id)
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async movie(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto)
  }
}
