import { DB_ERROR_CODES } from '@app/common/constants/db-errors.constant'
import { CreateRatingDto } from '@app/contracts/movie/ratings/create-rating.dto'
import { Rating } from '@app/contracts/movie/ratings/rating.dto'
import { MOVIES_SERVICE } from '@app/database/knex/knex.module'
import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectConnection } from 'nest-knexjs'

@Injectable()
export class RatingsService {
	private readonly tableName = 'ratings'

	constructor(@InjectConnection(MOVIES_SERVICE) private readonly knex: Knex) { }

	public async get(movieId: string) {
		const result = await this.knex(this.tableName)
			.where('movie_id', movieId)
			.avg('value as average_value')

		const rating = +result[0]?.average_value || 0
		
		return rating
	}

	public async create(userId: string, movieId: string, dto: CreateRatingDto) {
		try {
			const [rating] = await this.knex(this.tableName)
				.insert({
					'user_id': userId,
					'movie_id': movieId,
					'value': dto.value
				})
				.returning('*')
				.catch()

			return rating
		} catch (error) {
			if (error.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
				const [rating] = await this.knex<Rating>(this.tableName)
					.where('user_id', userId)
					.where('movie_id', movieId)
					.update({
						'value': dto.value,
					})
					.returning('*')

				return rating.value
			}
		}
	}
}
