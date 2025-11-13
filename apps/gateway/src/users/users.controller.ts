import { CreateUserDto } from '@app/contracts/users/create-user.dto'
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll() {
    return this.usersService.getAll()
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }
}
