import { BasePrismaService } from '@app/database/prisma'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaClient as AccountsPrismaClient } from './--generated--/client'

@Injectable()
export class AccountsPrismaService extends BasePrismaService<AccountsPrismaClient> {
	protected readonly logger = new Logger(AccountsPrismaService.name)
	protected readonly serviceName = 'accounts'
	protected readonly client = new AccountsPrismaClient()
	public readonly accounts = this.client.accounts
}