import { Module } from '@nestjs/common'
import { GenresController } from './genres.controller'
import { GenresService } from './genres.service'
import { GenresPrismaService } from './prisma'

@Module({
  imports: [],
  controllers: [GenresController],
  providers: [GenresService, GenresPrismaService],
})
export class GenresModule {}
