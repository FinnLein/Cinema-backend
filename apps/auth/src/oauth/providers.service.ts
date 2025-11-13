import { OAUTH_PROVIDERS } from '@app/common/constants/providers.constant'
import { TOAuthProviders } from '@app/common/types/social/oauth-providers.types'
import { Inject, Injectable } from '@nestjs/common'
import { BaseOAuthProvider } from './providers/base-oauth.provider'

@Injectable()
export class ProvidersService {
	constructor(
		@Inject(OAUTH_PROVIDERS) private readonly providers: BaseOAuthProvider[]
	) { }

	public getByProvider(provider: TOAuthProviders): BaseOAuthProvider | null {
		return this.providers.find(p => p.name === provider)
	}

}