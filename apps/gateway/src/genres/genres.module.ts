import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { GENRES_CLIENT } from '@app/common/client-config/clients.constants'
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { GenresController } from './genres.controller'
import { GenresService } from './genres.service'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GENRES_CLIENT,
        imports: [ClientConfigModule],
        inject: [ClientConfigService],
        useFactory: (config: ClientConfigService) => config.GenresClientOptions
      }
    ])
  ],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}
