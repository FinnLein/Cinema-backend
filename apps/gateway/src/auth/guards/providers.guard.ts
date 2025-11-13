import { AUTH_CLIENT } from '@app/common/client-config/clients.constants'
import { TOAuthProviders } from '@app/common/types/social/oauth-providers.types'
import { PROVIDERS_PATTERNS } from '@app/contracts/auth/auth.patterns'
import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Request } from 'express'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class ProvidersGuard implements CanActivate {
	constructor(
		@Inject(AUTH_CLIENT) private readonly authClient: ClientProxy
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest() as Request
		const provider = req.params.provider as TOAuthProviders
		const providerInstance = await lastValueFrom(this.authClient.send(PROVIDERS_PATTERNS.GET_BY_PROVIDER, provider))

		if (!providerInstance) throw new NotFoundException(`Provider ${provider} not found`)

		return true
	}
}