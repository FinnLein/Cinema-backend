import { IsOptional, IsString } from 'class-validator'

export class PaginationArgs { 
	@IsOptional()
	@IsString()
	page?: string
	
	@IsOptional()
	@IsString()
	limit?: string
}