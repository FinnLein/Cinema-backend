import { PasswordMatchConstraint } from '@app/common/constraints/password-match.constraint'
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	username: string

	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	password: string

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	@Validate(PasswordMatchConstraint)
	passwordRepeat: string
}