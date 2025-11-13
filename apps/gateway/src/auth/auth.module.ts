import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { AUTH_CLIENT, JWT_TOKENS_CLIENT } from '@app/common/client-config/clients.constants'
import { IS_DEV } from '@app/common/utils/is-dev.util'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ClientsModule } from '@nestjs/microservices'
import { ThrottlerModule } from '@nestjs/throttler'
import { ProvidersModule } from 'apps/auth/src/oauth/providers.module'
import { ProvidersService } from 'apps/auth/src/oauth/providers.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CheckBlacklistGuard } from './guards/check-blacklist.guard'
import { TokensService } from './tokens.service'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_CLIENT,
        imports: [ClientConfigModule],
        useFactory: (config: ClientConfigService) => config.AuthClientOptions,
        inject: [ClientConfigService]
      },
      {
        name: JWT_TOKENS_CLIENT,
        imports: [ClientConfigModule],
        useFactory: (config: ClientConfigService) => config.JwtTokensClientOptions,
        inject: [ClientConfigService]
      },
    ]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 300,
          limit: 5
        }
      ]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '/.env',
      ignoreEnvFile: !IS_DEV
    }),
    ProvidersModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CheckBlacklistGuard
    },
    AuthService,
    TokensService,
    ProvidersService
  ],
})
export class AuthModule { }
