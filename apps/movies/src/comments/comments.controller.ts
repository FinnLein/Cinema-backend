import { COMMENTS_PATTERN } from '@app/contracts/movie/comments/comments.pattern'
import { CreateCommentDto } from '@app/contracts/movie/comments/create-comment.dto'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CommentsService } from './comments.service'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {

  }

  @MessagePattern(COMMENTS_PATTERN.CREATE)
  public async create(@Payload() payload: { userId: string, movieId: string, dto: CreateCommentDto }) {
    return this.commentsService.create(payload.movieId, payload.userId, payload.dto)
  }
}
