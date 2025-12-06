import { Auth } from '@app/common/decorators/auth.decorator'
import { Public } from '@app/common/decorators/public.decorator'
import { CreateMovieDto } from '@app/contracts/movie/create-movie.dto'
import { FilterMovieDto } from '@app/contracts/movie/filter.dto'
import { UpdateMovieDto } from '@app/contracts/movie/update-movie.dto'
import { UserRole } from '@app/contracts/users/user.dto'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { MoviesService } from './movies.service'

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Public()
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

  @Public()
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  public async getBySlug(@Param('slug') slug: string) {
    return this.moviesService.getBySlug(slug)
  }

  @Public()
  @Get('by-genre/:genre')
  @HttpCode(HttpStatus.OK)
  public async getByGenre(
    @Query() dto: FilterMovieDto,
    @Param('genre') genre: string
  ) {
    return this.moviesService.getByGenre(dto, genre)
  }

  @Public()
  @Get('by-actor/:actor')
  @HttpCode(HttpStatus.OK)
  public async getByActor(
    @Query() dto: FilterMovieDto,
    @Param('actor') actor: string
  ) {
    return this.moviesService.getByActor(dto, actor)
  }

  @Public()
  @Get('similar/:id')
  @HttpCode(HttpStatus.OK)
  public async getSimilar(
    @Param('id') id: string
  ) {
    return this.moviesService.getSimilar(id)
  }

  @Public()
  @Get('most-popular')
  @HttpCode(HttpStatus.OK)
  public async getMostPopular() {
    return this.moviesService.getMostPopular()
  }

  @Auth(UserRole.ADMIN)
  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto)
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Body() dto: UpdateMovieDto,
    @Param('id') id: string
  ) {
    return this.moviesService.update(id, dto)
  }

  @Auth(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(
    @Param('id') id: string
  ) {
    return this.moviesService.delete(id)
  }
}
