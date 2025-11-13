import { IS_DEV } from '@app/common/utils/is-dev.util'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'
import { AccountsPrismaService } from './prisma'

@Module({
  imports: [
   ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '/.env',
      expandVariables: true,
      ignoreEnvFile: !IS_DEV
    }),  ],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsPrismaService],
})
export class AccountsModule { }
