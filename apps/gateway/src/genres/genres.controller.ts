import { Auth } from '@app/common/decorators/auth.decorator'
import { Public } from '@app/common/decorators/public.decorator'
import { CreateGenreDto } from '@app/contracts/genres/create-genre.dto'
import { UpdateGenreDto } from '@app/contracts/genres/update-genre.dto'
import { UserRole } from '@app/contracts/users/user.dto'
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { GenresService } from './genres.service'

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) { }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll() {
    return this.genresService.getAll()
  }

  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  public async getById(@Param('id') id: string) {
    return this.genresService.getById(id)
  }

  @Public()
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  public async getBySlug(@Param('slug') slug: string) {
    return this.genresService.getBySlug(slug)
  }

  @Auth(UserRole.ADMIN)
  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(@Body() dto: CreateGenreDto) {
    return this.genresService.create(dto)
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateGenreDto
  ) {
    return this.genresService.update(id, dto)
  }

}
