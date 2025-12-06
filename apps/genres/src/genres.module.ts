import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { MOVIES_CLIENT } from '@app/common/client-config/clients.constants'
import { CustomKnexModule } from '@app/database/knex/knex.module'
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { GenresController } from './genres.controller'
import { GenresService } from './genres.service'

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
    CustomKnexModule
  ],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule { }
