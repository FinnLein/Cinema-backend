import { NestFactory } from '@nestjs/core';
import { TokensModule } from './tokens.module';

async function bootstrap() {
  const app = await NestFactory.create(TokensModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
