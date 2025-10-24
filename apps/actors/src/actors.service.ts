import { Injectable } from '@nestjs/common';

@Injectable()
export class ActorsService {
  getHello(): string {
    return 'Hello World!';
  }
}
