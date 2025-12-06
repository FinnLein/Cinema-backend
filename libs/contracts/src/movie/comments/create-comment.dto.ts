import { PickType } from '@nestjs/mapped-types'
import { CommentDto } from './comment.dto'

export class CreateCommentDto extends PickType(CommentDto, ['text'] as const) { }