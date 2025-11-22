import { CustomRpcExceptionFilter } from '@app/common/filters/rpc-exception.filter'
import { IS_DEV } from '@app/common/utils/is-dev.util'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { EmailModule } from './email/email.module'
import { MoviesModule } from './movies/movies.module'
import { UsersModule } from './users/users.module'
import { GenresModule } from './genres/genres.module';
import { ActorsModule } from './actors/actors.module';


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
    EmailModule,
    MoviesModule,
    GenresModule,
    ActorsModule
  ],
  controllers: [],
  providers: [CustomRpcExceptionFilter],
})
export class AppModule { }
