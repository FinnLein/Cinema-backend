import { BasePrismaService } from '@app/database/prisma'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaClient as UsersPrismaClient } from './generated/client'

@Injectable()
export class UsersPrismaService extends BasePrismaService<UsersPrismaClient> {
	protected readonly logger = new Logger(UsersPrismaService.name)
	protected readonly serviceName = 'users'
	protected readonly client = new UsersPrismaClient()
	public readonly user = this.client.users
}