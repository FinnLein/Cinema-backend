import { OmitType, PartialType } from '@nestjs/mapped-types'
import { Genre } from './genre.dto'

export class UpdateGenreDto extends PartialType(OmitType(Genre, ['id'])) { }