import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class Actor {
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
	picture: string
}