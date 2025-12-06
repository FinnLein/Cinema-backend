import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CommentDto {
	@IsOptional()
	@IsString()
	id?: string

	@IsString()
	@IsNotEmpty()
	movieId: string

	@IsString()
	@IsNotEmpty()
	userId: string

	@IsString()
	@IsNotEmpty()
	@MaxLength(200, {message: 'Text should be maximum 200 symbols.'})
	text: string
	
	createdAt: Date
}