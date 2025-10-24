import { NestFactory } from '@nestjs/core';
import { MoviesModule } from './movies.module';

async function bootstrap() {
  const app = await NestFactory.create(MoviesModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
