import { Injectable } from '@nestjs/common';

@Injectable()
export class TokensService {
  getHello(): string {
    return 'Hello World!';
  }
}
