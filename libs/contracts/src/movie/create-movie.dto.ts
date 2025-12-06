import { OmitType } from '@nestjs/mapped-types'
import { FullMovie } from './movie.dto'

export class CreateMovieDto extends OmitType(FullMovie, ['id'] as const) {}