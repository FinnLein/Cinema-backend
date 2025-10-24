import { Module } from '@nestjs/common'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'
import { AccountsPrismaService } from './prisma'

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsPrismaService],
})
export class AccountsModule { }
