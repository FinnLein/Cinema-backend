import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { RedisModule } from '@app/database/redis/redis.module'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule } from '@nestjs/microservices'
import { JwtTokensController } from './jwt-tokens.controller'
import { JwtTokensService } from './jwt-tokens.service'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USERS_CLIENT,
        imports: [ClientConfigModule],
        useFactory: (config: ClientConfigService) => config.UsersClientOptions,
        inject: [ClientConfigService]
      }
    ]),
    JwtModule,
    RedisModule],
  controllers: [JwtTokensController],
  providers: [JwtTokensService],
})
export class JwtTokensModule {}
