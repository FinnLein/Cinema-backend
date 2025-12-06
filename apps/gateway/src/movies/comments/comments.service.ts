import { MOVIES_CLIENT } from '@app/common/client-config/clients.constants'
import { COMMENTS_PATTERN } from '@app/contracts/movie/comments/comments.pattern'
import { CreateCommentDto } from '@app/contracts/movie/comments/create-comment.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class CommentsService {
	constructor(
		@Inject(MOVIES_CLIENT) private readonly moviesClient: ClientProxy
	) { }

	public async create(movieId: string, userId: string, dto: CreateCommentDto) {
		return this.moviesClient.send(COMMENTS_PATTERN.CREATE, { userId, movieId, dto })
	}
}
