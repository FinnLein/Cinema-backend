import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { MOVIES_CLIENT } from '@app/common/client-config/clients.constants'
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { MoviesController } from './movies.controller'
import { MoviesService } from './movies.service'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MOVIES_CLIENT,
        imports: [ClientConfigModule],
        inject: [ClientConfigService],
        useFactory: (config: ClientConfigService) => config.MoviesClientOptions
      }
    ])
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule { }
