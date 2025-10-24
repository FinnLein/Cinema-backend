import { Controller, Get } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller()
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  getHello(): string {
    return this.genresService.getHello();
  }
}
