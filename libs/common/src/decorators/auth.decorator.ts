import { UserRole } from '@app/contracts/users/user.dto'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../guards/jwt.guard'
import { RoleGuard } from '../guards/role.guard'
import { Roles } from './roles.decorator'

export function Auth(role: UserRole | UserRole[] = [UserRole.USER]) {
	if (!Array.isArray(role)) {
		role = [role]
	}

	return applyDecorators(Roles(...role), UseGuards(JwtGuard, RoleGuard))
}