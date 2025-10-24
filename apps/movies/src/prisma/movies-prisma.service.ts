import { BasePrismaService } from '@app/database/prisma'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaClient as MoviesPrismaClient } from './generated/client'

@Injectable()
export class MoviesPrismaService extends BasePrismaService<MoviesPrismaClient> {
	protected readonly logger = new Logger(MoviesPrismaService.name)
	protected readonly serviceName = 'movies'
	protected readonly client = new MoviesPrismaClient()
	public readonly movies = this.client.movies
}