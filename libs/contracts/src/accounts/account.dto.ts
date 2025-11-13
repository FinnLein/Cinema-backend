import { type TOAuthProviders } from '@app/common/types/social/oauth-providers.types'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class AccountDto {
	
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	id?: string

	
	@IsString()
	@IsNotEmpty()
	userId: string

	@IsString()
	@IsNotEmpty()
	type: string

	@IsString()
	@IsNotEmpty()
	provider: TOAuthProviders

	@IsString()
	@IsNotEmpty()
	providerId: string

	@IsString()
	@IsNotEmpty()
	accessToken: string

	@IsString()
	@IsNotEmpty()
	refreshToken: string

	@IsNumber()
	@IsNotEmpty()
	expiresIn: number
}