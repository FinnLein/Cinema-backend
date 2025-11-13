import { CustomRpcExceptionFilter } from '@app/common/filters/rpc-exception.filter'
import { getMicroserviceOptions } from '@app/common/utils/get-microservice-options.util'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { TokensModule } from './tokens.module'

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(TokensModule)
  const config = appContext.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TokensModule, getMicroserviceOptions(config))

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalFilters(new CustomRpcExceptionFilter())

  await app.listen()
}
bootstrap()
