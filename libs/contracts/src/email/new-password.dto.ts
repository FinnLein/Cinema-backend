import { IsString, MinLength } from 'class-validator'

export class NewPasswordDto {
	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	password: string
}