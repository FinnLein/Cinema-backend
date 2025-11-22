import { CustomKnexModule } from '@app/database/knex/knex.module'
import { Module } from '@nestjs/common'
import { ActorsController } from './actors.controller'
import { ActorsService } from './actors.service'

@Module({
  imports: [CustomKnexModule],
  controllers: [ActorsController],
  providers: [ActorsService],
})
export class ActorsModule {}
