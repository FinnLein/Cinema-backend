import { Auth } from '@app/common/decorators/auth.decorator'
import { CreateUserDto } from '@app/contracts/users/create-user.dto'
import { UpdateUserDto } from '@app/contracts/users/update-user.dto'
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common'

import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import { Public } from '@app/common/decorators/public.decorator'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  public async getAll() {
    return this.usersService.getAll()
  }

  @Auth()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  public async getProfile(@CurrentUser('id') id: string){
    return this.usersService.getProfile(id)
  }

  @Auth()
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  public async updateProfile(@CurrentUser('id') id: string, @Body() dto: UpdateUserDto){
    return this.usersService.updateProfile(id, dto)
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }
}
