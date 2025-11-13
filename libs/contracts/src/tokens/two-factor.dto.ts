import { IsString, MaxLength, MinLength } from 'class-validator'

export class TwoFactorDto {
	@IsString()
	@MinLength(6, { message: 'Token must be 6 characters long' })
	@MaxLength(6, { message: 'Token must be 6 characters long' })
	token: string
}