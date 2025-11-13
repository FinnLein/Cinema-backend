import { type TOAuthProviders } from '@app/common/types/social/oauth-providers.types'
import { PROVIDERS_PATTERNS } from '@app/contracts/auth/auth.patterns'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ProvidersService } from './providers.service'

@Controller()
export class ProvidersController {
	constructor(
		private readonly providersService: ProvidersService
	) { }

	@MessagePattern(PROVIDERS_PATTERNS.GET_BY_PROVIDER)
	public async getByProvider(@Payload() provider: TOAuthProviders) {
		return this.providersService.getByProvider(provider)
	}
}