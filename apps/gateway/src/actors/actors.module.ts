import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { ACTORS_CLIENT, MEDIA_CLIENT } from '@app/common/client-config/clients.constants'
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { ActorsController } from './actors.controller'
import { ActorsService } from './actors.service'
import { MediaService } from '../media/media.service'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ACTORS_CLIENT,
        imports: [ClientConfigModule],
        inject: [ClientConfigService],
        useFactory: (config: ClientConfigService) => config.ActorsClientOptions
      },
      {
        name: MEDIA_CLIENT,
        imports: [ClientConfigModule],
        inject: [ClientConfigService],
        useFactory: (config: ClientConfigService) => config.MediaClientOptions
      },
    ])
  ],
  controllers: [ActorsController],
  providers: [ActorsService, MediaService],
})
export class ActorsModule { }
