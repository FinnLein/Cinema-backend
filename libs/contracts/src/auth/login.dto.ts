import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class LoginDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	password: string

	@IsOptional()
	@IsString()
	@MinLength(6, { message: 'Code must be 6 symbols' })
	token?: string
}
