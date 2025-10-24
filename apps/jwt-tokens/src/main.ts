import { NestFactory } from '@nestjs/core';
import { JwtTokensModule } from './jwt-tokens.module';

async function bootstrap() {
  const app = await NestFactory.create(JwtTokensModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
