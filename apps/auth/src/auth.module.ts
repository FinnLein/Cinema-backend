import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { ACCOUNTS_CLIENT, EMAIL_CLIENT, JWT_TOKENS_CLIENT, USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { IS_DEV } from '@app/common/utils/is-dev.util'
import { RedisModule } from '@app/database/redis/redis.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ProvidersModule } from './oauth/providers.module'
import { ProvidersService } from './oauth/providers.service'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USERS_CLIENT,
        imports: [ClientConfigModule],
        useFactory: (config: ClientConfigService) => config.UsersClientOptions,
        inject: [ClientConfigService]
      },
      {
        name: EMAIL_CLIENT,
        imports: [ClientConfigModule],
        useFactory: (config: ClientConfigService) => config.EmailClientOptions,
        inject: [ClientConfigService]
      },
      {
        name: JWT_TOKENS_CLIENT,
        imports: [ClientConfigModule],
        useFactory: (config: ClientConfigService) => config.JwtTokensClientOptions,
        inject: [ClientConfigService]
      },
      {
        name: ACCOUNTS_CLIENT,
        imports: [ClientConfigModule],
        useFactory: (config: ClientConfigService) => config.AccountsClientOptions,
        inject: [ClientConfigService]
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '/.env',
      ignoreEnvFile: !IS_DEV,
      expandVariables: true,
    }),
    RedisModule,
    ProvidersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, ProvidersService],
})
export class AuthModule { }
