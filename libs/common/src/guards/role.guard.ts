import { User, UserRole } from '@app/contracts/users/user.dto'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector
	) { }

	canActivate(context: ExecutionContext): Promise<boolean> | boolean {
		const role = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler, context.getClass])

		if (!role) return true

		const req = context.switchToHttp().getRequest()
		const user = req?.user as User

		const hasRole = user.role.some(r => role.includes(r))
		if (!hasRole) throw new ForbiddenException('Forbidden resource')

		return true
	}
}