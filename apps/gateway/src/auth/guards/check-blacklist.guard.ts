import { JWT_TOKENS_CLIENT } from '@app/common/client-config/clients.constants'
import { REFRESH_TOKEN } from '@app/common/constants/tokens.constant'
import { JWT_TOKENS_PATTERNS } from '@app/contracts/jwt-tokens/jwt-tokens.patterns'
import { BadRequestException, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'
import { Request } from 'express'
import { lastValueFrom } from 'rxjs'

export class CheckBlacklistGuard implements CanActivate {
	constructor(
		@Inject(JWT_TOKENS_CLIENT) private readonly jwtTokensClient: ClientProxy,
		private readonly reflector: Reflector
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest() as Request

		const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler())

		if (isPublic) return true

		const refreshToken = req.cookies[REFRESH_TOKEN]

		if (!refreshToken) throw new UnauthorizedException('No token')

		const isBlacklist = await lastValueFrom(this.jwtTokensClient.send(JWT_TOKENS_PATTERNS.CHECK_BLACKLIST, refreshToken))

		if (isBlacklist) throw new BadRequestException('Refresh token is revoked')

		return true
	}
}