import { createHashSha256 } from '@app/common/utils/create-hash'
import { CreateTokenDto } from '@app/contracts/tokens/create-token.dto'
import { TokenType } from '@app/contracts/tokens/token.dto'
import { Injectable } from '@nestjs/common'
import { TokensPrismaService } from './prisma'

@Injectable()
export class TokensService {
  constructor(
    private readonly prisma: TokensPrismaService
  ) { }

  public async create(dto: CreateTokenDto) {
    return this.prisma.tokens.create({
      data: {
        ...dto,
        token: createHashSha256(dto.token)
      }
    })
  }

  public async delete(id: string) {
    return this.prisma.tokens.delete({
      where: {
        id
      }
    })
  }

  public async deleteMany(id: string, type: TokenType, now: Date) {
    return this.prisma.tokens.deleteMany({
      where: {
        id,
        type,
        expiresAt: {
          gt: now
        }
      }
    })
   }


  public async find(token: string, type: TokenType) {
    return this.prisma.tokens.findFirst({
      where: {
        token: createHashSha256(token),
        type,
      }
    })
  }

  public async findByEmail(email: string, type: TokenType) {
    return this.prisma.tokens.findFirst({
      where: {
        email,
        type
      }
    })
  }

}
