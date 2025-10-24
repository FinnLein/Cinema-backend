import { Module } from '@nestjs/common'
import { ActorsController } from './actors.controller'
import { ActorsService } from './actors.service'
import { ActorsPrismaService } from './prisma'

@Module({
  imports: [],
  controllers: [ActorsController],
  providers: [ActorsService, ActorsPrismaService],
})
export class ActorsModule {}
