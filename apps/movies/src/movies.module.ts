import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { ACTORS_CLIENT, GENRES_CLIENT } from '@app/common/client-config/clients.constants'
import { CustomKnexModule } from '@app/database/knex/knex.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { CommentsController } from './comments/comments.controller'
import { CommentsService } from './comments/comments.service'
import { MoviesController } from './movies.controller'
import { MoviesService } from './movies.service'
import { RatingsController } from './ratings/ratings.controller'
import { RatingsService } from './ratings/ratings.service'
import { RedisModule } from '@app/database/redis/redis.module'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GENRES_CLIENT,
        imports: [ClientConfigModule],
        inject: [ClientConfigService],
        useFactory: (config: ClientConfigService) => config.GenresClientOptions
      },
      {
        name: ACTORS_CLIENT,
        imports: [ClientConfigModule],
        inject: [ClientConfigService],
        useFactory: (config: ClientConfigService) => config.ActorsClientOptions
      },
    ]),
    ConfigModule,
    CustomKnexModule,
    RedisModule,
  ],
  controllers: [MoviesController, CommentsController, RatingsController],
  providers: [MoviesService, CommentsService, RatingsService],
})
export class MoviesModule { }
