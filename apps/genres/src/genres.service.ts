import { Injectable } from '@nestjs/common';

@Injectable()
export class GenresService {
  getHello(): string {
    return 'Hello World!';
  }
}
