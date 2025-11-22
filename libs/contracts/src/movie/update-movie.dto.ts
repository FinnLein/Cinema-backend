import { OmitType, PartialType } from '@nestjs/mapped-types'
import { FullMovie } from './movie.dto'

export class UpdateMovieDto extends PartialType(OmitType(FullMovie, ['countOpened', 'id', "genres", 'actors'] as const)) { }