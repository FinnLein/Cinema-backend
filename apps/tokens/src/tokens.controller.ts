import { Controller, Get } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Controller()
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  getHello(): string {
    return this.tokensService.getHello();
  }
}
