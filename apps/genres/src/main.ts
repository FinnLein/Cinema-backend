import { NestFactory } from '@nestjs/core';
import { GenresModule } from './genres.module';

async function bootstrap() {
  const app = await NestFactory.create(GenresModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
