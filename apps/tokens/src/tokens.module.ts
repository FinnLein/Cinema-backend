import { IS_DEV } from '@app/common/utils/is-dev.util'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TokensPrismaService } from './prisma'
import { TokensController } from './tokens.controller'
import { TokensService } from './tokens.service'

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '/.env',
    expandVariables: true,
    ignoreEnvFile: !IS_DEV
  }),],
  controllers: [TokensController],
  providers: [TokensService, TokensPrismaService],
})
export class TokensModule { }
