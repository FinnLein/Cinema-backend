import { PickType } from '@nestjs/mapped-types'
import { Rating } from './rating.dto'

export class CreateRatingDto extends PickType(Rating, ['value'] as const) {

}