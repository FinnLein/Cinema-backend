import { CustomRpcExceptionFilter } from '@app/common/filters/rpc-exception.filter'
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

  app.use(cookieParser())
  app.useGlobalFilters(new CustomRpcExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({transform: true}))


  await app.listen(config.get<number>('APPLICATION_PORT') ?? 4200)
}
bootstrap()
