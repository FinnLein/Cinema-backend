import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USERS_CLIENT,
        imports: [ClientConfigModule],
        useFactory: (config: ClientConfigService) => config.UsersClientOptions,
        inject: [ClientConfigService]
      }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
