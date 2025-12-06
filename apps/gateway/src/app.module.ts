import { IS_DEV } from '@app/common/utils/is-dev.util'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ActorsModule } from './actors/actors.module'
import { AuthModule } from './auth/auth.module'
import { EmailModule } from './email/email.module'
import { GenresModule } from './genres/genres.module'
import { MediaModule } from './media/media.module'
import { MoviesModule } from './movies/movies.module'
import { UsersModule } from './users/users.module'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: !IS_DEV
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    MoviesModule,
    GenresModule,
    ActorsModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
