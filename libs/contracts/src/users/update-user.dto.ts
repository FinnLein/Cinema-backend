import { PartialType, PickType } from '@nestjs/mapped-types'
import { User } from './user.dto'

export class UpdateUserDto extends PartialType(PickType(User, ['email', 'username', 'picture', 'isTwoFactor'] as const)) { }