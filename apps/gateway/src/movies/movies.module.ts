import { ClientConfigModule } from '@app/common/client-config/client-config.module'
import { ClientConfigService } from '@app/common/client-config/client-config.service'
import { MOVIES_CLIENT } from '@app/common/client-config/clients.constants'
import { RedisModule } from '@app/database/redis/redis.module'
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { CommentsController } from './comments/comments.controller'
import { CommentsService } from './comments/comments.service'
import { MoviesController } from './movies.controller'
import { MoviesService } from './movies.service'
import { RatingsController } from './ratings/ratings.controller'
import { RatingsService } from './ratings/ratings.service'

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
    RedisModule
  ],
  controllers: [MoviesController, CommentsController, RatingsController],
  providers: [MoviesService, CommentsService, RatingsService],
})
export class MoviesModule { }
