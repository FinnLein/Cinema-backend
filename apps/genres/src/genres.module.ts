import { CustomKnexModule } from '@app/database/knex/knex.module'
import { Module } from '@nestjs/common'
import { GenresController } from './genres.controller'
import { GenresService } from './genres.service'

@Module({
  imports: [CustomKnexModule],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}
