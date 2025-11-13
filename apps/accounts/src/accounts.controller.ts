import { TOAuthProviders } from '@app/common/types/social/oauth-providers.types'
import { CreateAccountDto } from '@app/contracts/accounts/account-create.dto'
import { ACCOUNTS_PATTERNS } from '@app/contracts/accounts/accounts.patterns'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AccountsService } from './accounts.service'

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @MessagePattern(ACCOUNTS_PATTERNS.GET_BY_ID)
  public async getById(@Payload() payload: { id: string, provider: TOAuthProviders }) {
    return this.accountsService.getById(payload.id, payload.provider)
  }

  @MessagePattern(ACCOUNTS_PATTERNS.GET_BY_PROVIDER_ID)
  public async getByProviderId(@Payload() payload: { providerId: string, provider: TOAuthProviders }) {
    return this.accountsService.getByProviderId(payload.providerId, payload.provider)
  }

  @MessagePattern(ACCOUNTS_PATTERNS.CREATE)
  public async create(@Payload() dto: CreateAccountDto) {
    return this.accountsService.create(dto)
  }
}
