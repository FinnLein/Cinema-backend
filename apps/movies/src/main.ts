import { CustomRpcExceptionFilter } from '@app/common/filters/rpc-exception.filter'
import { getMicroserviceOptions } from '@app/common/utils/get-microservice-options.util'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { MoviesModule } from './movies.module'

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(MoviesModule)
  const config = context.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MoviesModule, getMicroserviceOptions(config))

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new CustomRpcExceptionFilter())

  await app.listen()
}
bootstrap()
