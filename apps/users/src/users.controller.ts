import { NewPasswordDto } from '@app/contracts/email/new-password.dto'
import { CreateUserDto } from '@app/contracts/users/create-user.dto'
import { UpdateUserDto } from '@app/contracts/users/update-user.dto'
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern(USERS_PATTERNS.GET_ALL)
  public async getAll() {
    return this.usersService.getAll()
  }

  @MessagePattern(USERS_PATTERNS.GET_BY_ID)
  public async getById(@Payload() id: string) {
    return this.usersService.getById(id)
  }

  @MessagePattern(USERS_PATTERNS.GET_BY_EMAIL)
  public async getByEmail(@Payload() email: string) {
    return this.usersService.getByEmail(email)
  }

  @MessagePattern(USERS_PATTERNS.UPDATE_PROFILE)
  public async updateProfile(@Payload() payload: { id: string, dto: UpdateUserDto }) {
    return this.usersService.updateProfile(payload.id, payload.dto)
  }

  @MessagePattern(USERS_PATTERNS.CREATE)
  public async create(@Payload() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @MessagePattern(USERS_PATTERNS.GET_OR_CREATE)
  public async getOrCreate(@Payload() payload: { id: string, dto: CreateUserDto }) {
    return this.usersService.getOrCreate(payload.id, payload.dto)
  }
  @MessagePattern(USERS_PATTERNS.CONFIRM_EMAIL)
  public async confirmEmail(@Payload() id: string) {
    return this.usersService.confirmEmail(id)
  }
  @MessagePattern(USERS_PATTERNS.NEW_PASSWORD)
  public async newPassword(@Payload() payload: {id: string, dto: NewPasswordDto}) {
    return this.usersService.newPassword(payload.id, payload.dto)
  }


}
