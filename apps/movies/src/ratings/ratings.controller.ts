import { CreateRatingDto } from '@app/contracts/movie/ratings/create-rating.dto'
import { RATINGS_PATTERNS } from '@app/contracts/movie/ratings/ratings.patterns'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { RatingsService } from './ratings.service'

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) { }

  @MessagePattern(RATINGS_PATTERNS.CREATE)
  public async create(@Payload() payload: { userId: string, movieId: string, dto: CreateRatingDto }) {
    return this.ratingsService.create(payload.userId, payload.movieId, payload.dto)
  }
}
