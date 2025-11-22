import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Actor } from '../actors/actor.dto'
import { Genre } from '../genres/genre.dto'

export class Movie {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsNotEmpty()
  slug: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  poster: string

  @IsString()
  @IsNotEmpty()
  bigPoster: string

  @IsString()
  @IsNotEmpty()
  videoUrl: string

  @IsString()
  @IsNotEmpty()
  year: number

  @IsNumber()
  @IsNotEmpty()
  duration: number
  
  @IsString()
  @IsNotEmpty()
  country: string

  @IsOptional()
  @IsBoolean()
  isSentTelegram?: boolean

  @IsNotEmpty()
  @IsInt()
  rating: number

  @IsOptional()
  @IsBoolean()
  countOpened?: number
}

export class FullMovie extends Movie {
  @IsNotEmpty()
  actors: Actor[]

  @IsNotEmpty()
  genres: Genre[]
}