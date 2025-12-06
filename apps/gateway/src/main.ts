import { RpcExceptionFilter } from '@app/common/filters/rpc'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: 'set-cookie'
  })

  app.useGlobalFilters(new RpcExceptionFilter())
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))


  await app.listen(config.get<number>('APPLICATION_PORT'))
}
bootstrap()
