import { TOAuthProviders } from '@app/common/types/social/oauth-providers.types'
import { CreateAccountDto } from '@app/contracts/accounts/account-create.dto'
import { AccountDto } from '@app/contracts/accounts/account.dto'
import { Injectable } from '@nestjs/common'
import { AccountsPrismaService } from './prisma'

@Injectable()
export class AccountsService {
  constructor(
    private readonly prisma: AccountsPrismaService
  ) { }

  public async getById(id: string, provider: TOAuthProviders): Promise<AccountDto> {
    return this.prisma.accounts.findUnique({
      where: {
        id,
        provider
      }
    })
  }
  public async getByProviderId(providerId: string, provider: TOAuthProviders): Promise<AccountDto> {
    return this.prisma.accounts.findUnique({
      where: {
        provider_providerId: {
          providerId,
          provider
        }
      }
    })
  }

  public async create(dto: CreateAccountDto) {
    return this.prisma.accounts.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        provider: dto.provider,
        providerId: dto.providerId,
        accessToken: dto.accessToken,
        refreshToken: dto.refreshToken,
        expiresIn: dto.expiresIn
      }
    })
  }
}
