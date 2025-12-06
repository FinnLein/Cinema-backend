import { User } from '@app/contracts/users/user.dto'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest()
		const user = req.user as User
		return data ? user[data] : user
	}
)