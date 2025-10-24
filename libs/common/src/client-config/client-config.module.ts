import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import joi from 'joi'
import { ClientConfigService } from './client-config.service'

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: false,
    validationSchema: joi.object({
      AUTH_CLIENT_PORT: joi.number().default(6379),
      ACCOUNTS_CLIENT_PORT: joi.number().default(6379),
      ACTORS_CLIENT_PORT: joi.number().default(6379),
      EMAIL_CLIENT_PORT: joi.number().default(6379),
      GENRES_CLIENT_PORT: joi.number().default(6379),
      MOVIES_CLIENT_PORT: joi.number().default(6379),
      TOKENS_CLIENT_PORT: joi.number().default(6379),
      USERS_CLIENT_PORT: joi.number().default(6379),  
      JWT_TOKENS_CLIENT_PORT: joi.number().default(6379),  
    })
  })],
  providers: [ClientConfigService],
  exports: [ClientConfigService]
})
export class ClientConfigModule { }
