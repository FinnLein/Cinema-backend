import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { JwtTokensModule } from './jwt-tokens.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(JwtTokensModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: 6379,
      password: process.env.REDIS_PASS,
    }
  });
  await app.listen();
}
bootstrap();
