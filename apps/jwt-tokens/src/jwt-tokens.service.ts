import { USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { createHashSha256 } from '@app/common/utils/create-hash'
import { ms } from '@app/common/utils/ms.util'
import { UserDto, UserRole } from '@app/contracts/users/user.dto'
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns'
import { REDIS_CLIENT } from '@app/database/redis/redis.constants'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import Redis from 'ioredis'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class JwtTokensService {
  private readonly ACCESS_TOKEN_EXPIRATION = '15m'
  private readonly REFRESH_TOKEN_EXPIRATION = '30d'
  private readonly REDIS_REFRESH_TOKEN_PREFIX = 'refreshToken:sha256:'
  private readonly REDIS_BLACKLIST_TOKEN_PREFIX = 'blacklistToken:sha256:'

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
    private readonly jwt: JwtService
  ) { }

  public async generate(id: string, role: UserRole[]) {
    const data = { id, role }

    const accessToken = this.jwt.sign(data, {
      expiresIn: this.ACCESS_TOKEN_EXPIRATION
    })

    const refreshToken = this.jwt.sign(data, {
      expiresIn: this.REFRESH_TOKEN_EXPIRATION
    })

    await this.saveRefreshToken(id, refreshToken)

    return {
      accessToken, refreshToken
    }
  }

  public async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken)

    if (!result) throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Refresh token expired or not exist' })

    const user = await lastValueFrom(this.usersClient.send<UserDto>(USERS_PATTERNS.FIND, result.id))

    if (!user) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'User not found' })

    await this.verifyRefreshToken(result.userId, refreshToken)

    await this.blacklistToken(refreshToken)

    return this.generate(user.id, user.role)

  }

  public async blacklistToken(token: string) {
    const result = await this.jwt.verifyAsync(token) as { exp?: number } || null

    if (!result || !result.exp) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Token does not exist or does not contain exp' })

    const ttl = result.exp - Math.floor(Date.now() / 1000)

    if (ttl <= 0) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Token expired' })

    const key = createHashSha256(token)

    return this.redis.set(this.REDIS_BLACKLIST_TOKEN_PREFIX + key, '1', 'EX', ttl)
  }

  public async checkBlacklistToken(token: string) {
    const key = createHashSha256(token)
    const exists = await this.redis.exists(this.REDIS_BLACKLIST_TOKEN_PREFIX + key)
    return exists === 1
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const key = createHashSha256(refreshToken)
    return this.redis.set(this.REDIS_REFRESH_TOKEN_PREFIX + userId, key, 'EX', ms(this.REFRESH_TOKEN_EXPIRATION) / 1000)
  }

  private async verifyRefreshToken(userId: string, refreshToken: string) {
    const key = createHashSha256(refreshToken)
    const token = await this.redis.get(this.REDIS_REFRESH_TOKEN_PREFIX + userId)

    if (token !== key) throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid refresh token' })

    return token
  }
}
