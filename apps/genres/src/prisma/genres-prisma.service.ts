import { BasePrismaService } from '@app/database/prisma'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaClient as GenresPrismaClient } from './generated/client'

@Injectable()
export class GenresPrismaService extends BasePrismaService<GenresPrismaClient> {
	protected readonly logger = new Logger(GenresPrismaService.name)
	protected readonly serviceName = 'genres'
	protected readonly client = new GenresPrismaClient()
	public readonly genres = this.client.genres
}