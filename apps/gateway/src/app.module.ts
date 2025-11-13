import { IS_DEV } from '@app/common/utils/is-dev.util'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: !IS_DEV,
      expandVariables: true
    }),
    AuthModule,
    UsersModule,
    EmailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
