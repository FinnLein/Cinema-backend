import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'

dotenv.config()

export const isDev = (config: ConfigService): boolean => config.getOrThrow<string>('NODE_ENV') === 'development'
export const IS_DEV = process.env.NODE_ENV === 'development'