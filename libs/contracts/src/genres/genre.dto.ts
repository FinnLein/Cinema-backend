import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class Genre {
	@IsString()
	@IsOptional()
	id?: string

	@IsString()
	@IsNotEmpty()
	slug: string

	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	description: string

	@IsString()
	@IsNotEmpty()
	picture: string
}