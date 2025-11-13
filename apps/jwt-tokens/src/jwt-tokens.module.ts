import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { IS_DEV } from '@app/common/utils/is-dev.util'
import { RedisModule } from '@app/database/redis/redis.module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule } from '@nestjs/microservices'
import { JwtTokensController } from './jwt-tokens.controller'
import { JwtTokensService } from './jwt-tokens.service'
import { getJwtConfig } from './jwt.config'

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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '/.env',
      ignoreEnvFile: !IS_DEV,
      expandVariables: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig
    }),
    RedisModule,
  ],
  controllers: [JwtTokensController],
  providers: [JwtTokensService],
})
export class JwtTokensModule { }
