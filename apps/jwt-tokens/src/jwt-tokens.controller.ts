import { Controller, Get } from '@nestjs/common';
import { JwtTokensService } from './jwt-tokens.service';

@Controller()
export class JwtTokensController {
  constructor(private readonly jwtTokensService: JwtTokensService) {}

  @Get()
  getHello(): string {
    return this.jwtTokensService.getHello();
  }
}
