import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { MOVIES_CLIENT } from '@app/common/client-config/clients.constants'
import { CustomKnexModule } from '@app/database/knex/knex.module'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ClientsModule } from '@nestjs/microservices'
import { ActorsController } from './actors.controller'
import { ActorsService } from './actors.service'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MOVIES_CLIENT,
        imports: [ClientConfigModule],
        inject: [ClientConfigService],
        useFactory: (config: ClientConfigService) => config.MoviesClientOptions
      }
    ]),
    EventEmitterModule.forRoot(),
    CustomKnexModule],
  controllers: [ActorsController],
  providers: [ActorsService],
})
export class ActorsModule { }
