import { CustomRpcExceptionFilter } from '@app/common/filters/rpc-exception.filter'
import { getMicroserviceOptions } from '@app/common/utils/get-microservice-options.util'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { EmailModule } from './email.module'

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(EmailModule)
  const config = appContext.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EmailModule, getMicroserviceOptions(config))

  app.useGlobalFilters(new CustomRpcExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen()
}
bootstrap()
