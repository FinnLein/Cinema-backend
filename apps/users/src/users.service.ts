import { NewPasswordDto } from '@app/contracts/email/new-password.dto'
import { CreateUserDto } from '@app/contracts/users/create-user.dto'
import { UpdateUserDto } from '@app/contracts/users/update-user.dto'
import { User } from '@app/contracts/users/user.dto'
import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { UsersPrismaService } from './prisma'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: UsersPrismaService) { }

  public async getAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  public async getById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  public async getByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  public async updateProfile(id: string, dto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...dto
      }
    })

  }

  public async create(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password)
      }
    })
  }

  public async getOrCreate(id: string | null, dto: CreateUserDto): Promise<User> {
    let user = this.getById(id)

    if (!user) {
      user = this.create(dto)
    }
    return user
  }

  public async confirmEmail(id: string) {
    return this.prisma.user.update({
      where: {
        id
      },
      data: {
        isVerified: true
      }
    })
  }

  public async newPassword(id: string, dto: NewPasswordDto) { 
    return this.prisma.user.update({
      where: {
        id
      },
      data: {
        password: await hash(dto.password)
      }
    })
  }
}
