import { BasePrismaService } from '@app/database/prisma'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaClient as ActorsPrismaClient } from './generated/client'

@Injectable()
export class ActorsPrismaService extends BasePrismaService<ActorsPrismaClient> {
	protected readonly logger = new Logger(ActorsPrismaService.name)
	protected readonly serviceName = 'actors'
	protected readonly client= new ActorsPrismaClient()
	public readonly actors = this.client.actors
}