import { IS_DEV } from '@app/common/utils/is-dev.util'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersPrismaService } from './prisma'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '/.env',
    expandVariables: true,
    ignoreEnvFile: !IS_DEV
  }),],
  controllers: [UsersController],
  providers: [UsersService, UsersPrismaService],
})
export class UsersModule {

}
