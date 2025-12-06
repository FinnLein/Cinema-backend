import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class Rating {
	@IsOptional()
	@IsString()
	id?: string

	@IsString()
	@IsNotEmpty()
	movieId: string

	@IsString()
	@IsNotEmpty()
	userId: string

	@IsNumber()
	@Min(1)
	@Max(10)
	value: number

	createdAt: Date
}