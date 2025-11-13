import { UserRole } from '@app/contracts/users/user.dto'
import { SetMetadata } from '@nestjs/common'
export const ROLES_KEY = 'role'

export const Roles = (...role: UserRole[]) => SetMetadata(ROLES_KEY, role)