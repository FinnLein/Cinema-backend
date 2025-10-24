import { Module } from '@nestjs/common'
import { TokensPrismaService } from './prisma'
import { TokensController } from './tokens.controller'
import { TokensService } from './tokens.service'

@Module({
  imports: [],
  controllers: [TokensController],
  providers: [TokensService, TokensPrismaService],
})
export class TokensModule {}
