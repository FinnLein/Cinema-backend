import { Module } from '@nestjs/common'
import { MoviesController } from './movies.controller'
import { MoviesService } from './movies.service'
import { MoviesPrismaService } from './prisma'

@Module({
  imports: [],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesPrismaService],
})
export class MoviesModule {}
