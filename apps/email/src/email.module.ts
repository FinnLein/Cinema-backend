import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { TOKENS_CLIENT, USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { IS_DEV } from '@app/common/utils/is-dev.util'
import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { ConfirmEmailController } from './confirm-email/confirm-email.controller'
import { ConfirmEmailService } from './confirm-email/confirm-email.service'
import { EmailService } from './email.service'
import { getMailerConfig } from './mailer.config'
import { RecoverPasswordController } from './recover-password/recover-password.controller'
import { RecoverPasswordService } from './recover-password/recover-password.service'
import { TwoFactorController } from './two-factor/two-factor.controller'
import { TwoFactorService } from './two-factor/two-factor.service'


@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: TOKENS_CLIENT,
        imports: [ClientConfigModule],
        useFactory: (config: ClientConfigService) => config.TokensClientOptions,
        inject: [ClientConfigService]
      },
      {
        name: USERS_CLIENT,
        imports: [ClientConfigModule],
        useFactory: (config: ClientConfigService) => config.UsersClientOptions,
        inject: [ClientConfigService]
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '/.env',
      expandVariables: true,
      ignoreEnvFile: !IS_DEV
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailerConfig
    }),
  ],
  controllers: [ConfirmEmailController, RecoverPasswordController, TwoFactorController],
  providers: [EmailService, ConfirmEmailService, RecoverPasswordService, TwoFactorService],
})
export class EmailModule { }
