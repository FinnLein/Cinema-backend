import { MOVIES_CLIENT } from '@app/common/client-config/clients.constants'
import { CreateRatingDto } from '@app/contracts/movie/ratings/create-rating.dto'
import { RATINGS_PATTERNS } from '@app/contracts/movie/ratings/ratings.patterns'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class RatingsService {
	constructor(
		@Inject(MOVIES_CLIENT) private readonly moviesClient: ClientProxy
	) { }

	public async create(movieId: string, userId: string, dto: CreateRatingDto) {
		return this.moviesClient.send(RATINGS_PATTERNS.CREATE, { userId, movieId, dto })
	}
}
