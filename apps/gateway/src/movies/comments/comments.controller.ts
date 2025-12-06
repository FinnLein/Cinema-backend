import { Auth } from '@app/common/decorators/auth.decorator'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import { CreateCommentDto } from '@app/contracts/movie/comments/create-comment.dto'
import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { CommentsService } from './comments.service'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Auth()
  @Post(':movieId')
  @HttpCode(HttpStatus.OK)
  public async create(
    @CurrentUser('id') userId: string,
    @Param('movieId') movieId: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.commentsService.create(movieId, userId, dto)
  }
}
