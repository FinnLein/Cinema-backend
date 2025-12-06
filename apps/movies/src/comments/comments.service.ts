import { CommentDto } from '@app/contracts/movie/comments/comment.dto'
import { CreateCommentDto } from '@app/contracts/movie/comments/create-comment.dto'
import { IPaginationResponse } from '@app/contracts/movie/pagination-response.interface'
import { PaginationArgs } from '@app/contracts/movie/pagination.dto'
import { MOVIES_SERVICE } from '@app/database/knex/knex.module'
import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectConnection } from 'nest-knexjs'

@Injectable()
export class CommentsService {
	private readonly tableName = 'comments'

	constructor(@InjectConnection(MOVIES_SERVICE) private readonly knex: Knex) { }

	public async getAll(movieId: string, dto: PaginationArgs = {}): Promise<IPaginationResponse<CommentDto>> {
		const { limit = 20, page = 1 } = dto
		const offset = (+page - 1) * +limit

		const comments = await this.knex<CommentDto>(this.tableName)
			.select('*')
			.where('movie_id', movieId)
			.limit(+limit)
			.offset(+offset)
			.returning('*')

		const totalCountResult = await this.knex(this.tableName)
			.countDistinct('id as count')
			.first()

		const totalCount = totalCountResult.count as number

		const totalPages = Math.ceil(totalCount / +limit)

		return {
			data: comments,
			meta: {
				limit: +limit,
				currentPage: +page,
				totalCount,
				totalPages
			}
		}
	}

	public async create(movieId: string, userId: string, dto: CreateCommentDto) {
		const [comment] = await this.knex(this.tableName)
			.insert({
				'movie_id': movieId,
				'user_id': userId,
				'text': dto.text
			})
			.returning('*')
			
		return comment
	}
}
