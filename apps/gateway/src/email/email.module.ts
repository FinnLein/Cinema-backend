import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { EMAIL_CLIENT } from '@app/common/client-config/clients.constants'
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { EmailController } from './email.controller'
import { EmailService } from './email.service'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: EMAIL_CLIENT,
        imports: [ClientConfigModule],
        inject: [ClientConfigService],
        useFactory: (config: ClientConfigService) => config.EmailClientOptions
      }
    ])
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
