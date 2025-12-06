import { Auth } from '@app/common/decorators/auth.decorator'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import { CreateRatingDto } from '@app/contracts/movie/ratings/create-rating.dto'
import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { RatingsService } from './ratings.service'

@Controller('ratings')
export class RatingsController {
  constructor(private readonly commentsService: RatingsService) { }

  @Auth()
  @Post(':movieId')
  @HttpCode(HttpStatus.OK)
  public async create(
    @CurrentUser('id') userId: string,
    @Param('movieId') movieId: string,
    @Body() dto: CreateRatingDto
  ) {
    return this.commentsService.create(movieId, userId, dto)
  }
}
