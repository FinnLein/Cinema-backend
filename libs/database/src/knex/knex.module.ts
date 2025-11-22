import { getDatabaseOptions } from '@app/common/utils/get-database-options.util'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { KnexModule } from 'nest-knexjs'

export const MOVIES_SERVICE = 'MOVIES'
export const ACTORS_SERVICE = 'ACTORS'
export const GENRES_SERVICE = 'GENRES'

@Module({
  imports: [
    KnexModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          config: {
            client: 'pg',
            connection: getDatabaseOptions(config, MOVIES_SERVICE),
            pool: {
              min: 2,
              max: 10
            },
          },
        }),
      }, MOVIES_SERVICE),
    KnexModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          config: {
            client: 'pg',
            connection: getDatabaseOptions(config, ACTORS_SERVICE),
            pool: {
              min: 2,
              max: 10
            },
          },
        }),
      }, ACTORS_SERVICE),
    KnexModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          config: {
            client: 'pg',
            connection: getDatabaseOptions(config, GENRES_SERVICE),
            pool: {
              min: 2,
              max: 10
            },
          },
        }),
      }, GENRES_SERVICE),

    ConfigModule
  ],
})
export class CustomKnexModule { }
