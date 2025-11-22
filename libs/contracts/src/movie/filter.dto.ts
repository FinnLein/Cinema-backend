import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationArgs } from './pagination.dto'

export const MovieSort = {
	OLDEST: 'OLDEST',
	NEWEST: 'NEWEST'
} as const

export type MovieSort = (typeof MovieSort)[keyof typeof MovieSort]

export class FilterMovieDto extends PaginationArgs {
	@IsString()
	@IsOptional()
	searchTerm?: string

	@IsString()
	@IsOptional()
	rating?: string

	@IsOptional()
	@IsEnum(MovieSort)
	sort?: MovieSort

	@IsString()
	@IsOptional()
	genres?: string
}