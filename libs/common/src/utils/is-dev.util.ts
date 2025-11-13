import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'

dotenv.config()

export const isDev = (config: ConfigService): boolean => config.getOrThrow<string>('NODE_ENV') === 'dev'
export const IS_DEV = process.env.NODE_ENV === 'dev'