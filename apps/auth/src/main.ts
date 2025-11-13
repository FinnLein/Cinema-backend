import { CustomRpcExceptionFilter } from '@app/common/filters/rpc-exception.filter'
import { getMicroserviceOptions } from '@app/common/utils/get-microservice-options.util'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { AuthModule } from './auth.module'

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AuthModule)
  const config = appContext.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, getMicroserviceOptions(config))

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new CustomRpcExceptionFilter())

  await app.listen()
}
bootstrap()
