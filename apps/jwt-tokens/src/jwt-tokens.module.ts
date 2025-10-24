import { Module } from '@nestjs/common';
import { JwtTokensController } from './jwt-tokens.controller';
import { JwtTokensService } from './jwt-tokens.service';

@Module({
  imports: [],
  controllers: [JwtTokensController],
  providers: [JwtTokensService],
})
export class JwtTokensModule {}
