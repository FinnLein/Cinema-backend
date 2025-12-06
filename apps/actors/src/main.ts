import { getMicroserviceOptions } from '@app/common/utils/get-microservice-options.util'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { ActorsModule } from './actors.module'

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(ActorsModule)
  const config = context.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ActorsModule, getMicroserviceOptions(config))

  app.useGlobalPipes(new ValidationPipe())

  await app.listen()
}
bootstrap()
