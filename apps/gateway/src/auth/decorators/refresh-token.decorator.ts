import { REFRESH_TOKEN } from '@app/common/constants/tokens.constant'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const RefreshToken = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest() as Request
		const refreshToken = req.cookies[REFRESH_TOKEN]

		return refreshToken
	}
)