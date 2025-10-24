import { BasePrismaService } from '@app/database/prisma'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaClient as TokensPrismaClient } from './generated/client'

@Injectable()
export class TokensPrismaService extends BasePrismaService<TokensPrismaClient> {
	protected readonly logger = new Logger(TokensPrismaService.name)
	protected readonly serviceName = 'tokens'
	protected readonly client = new TokensPrismaClient()
	public readonly tokens = this.client.tokens
}