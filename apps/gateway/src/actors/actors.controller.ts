import { Auth } from '@app/common/decorators/auth.decorator'
import { Public } from '@app/common/decorators/public.decorator'
import { CreateActorDto } from '@app/contracts/actors/create-actor.dto'
import { UpdateActorDto } from '@app/contracts/actors/update-actor.dto'
import { UserRole } from '@app/contracts/users/user.dto'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ActorsService } from './actors.service'

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) { }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll() {
    return this.actorsService.getAll()
  }

  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  public async getById(@Param('id') id: string) {
    return this.actorsService.getById(id)
  }

  @Public()
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  public async getBySlug(@Param('slug') slug: string) {
    return this.actorsService.getBySlug(slug)
  }

  @Auth(UserRole.ADMIN)
  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(@Body() dto: CreateActorDto) {
    return this.actorsService.create(dto)
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateActorDto
  ) {
    return this.actorsService.update(id, dto)
  }
  @Auth(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(
    @Param('id') id: string,
  ) {
    return this.actorsService.delete(id)
  }
}

