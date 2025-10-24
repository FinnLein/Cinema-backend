import { Controller, Get } from '@nestjs/common';
import { ActorsService } from './actors.service';

@Controller()
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Get()
  getHello(): string {
    return this.actorsService.getHello();
  }
}
