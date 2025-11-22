import { OmitType, PartialType } from '@nestjs/mapped-types'
import { Actor } from './actor.dto'

export class UpdateActorDto extends PartialType(OmitType(Actor, ['id'])) { }