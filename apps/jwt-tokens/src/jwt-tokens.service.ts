import { USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from '@app/common/constants/tokens.constant'
import { createHashSha256 } from '@app/common/utils/create-hash'
import { User, UserRole } from '@app/contracts/users/user.dto'
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns'
import { REDIS_CLIENT } from '@app/database/redis/redis.constants'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import Redis from 'ioredis'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class JwtTokensService {

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
      expiresIn: `${ACCESS_TOKEN_EXPIRATION}m`
    })

    const refreshToken = this.jwt.sign(data, {
      expiresIn: `${REFRESH_TOKEN_EXPIRATION}d`
    })

    await this.saveRefreshToken(id, refreshToken)

    return {
      accessToken, refreshToken
    }
  }

  public async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken)

    if (!result) throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Refresh token expired or not exist' })

    const user = await lastValueFrom(this.usersClient.send<User>(USERS_PATTERNS.GET_BY_ID, result.id))

    if (!user) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'User not found' })

    await this.verifyRefreshToken(result.id, refreshToken)

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
    return this.redis.set(this.REDIS_REFRESH_TOKEN_PREFIX + userId, key, 'EX', REFRESH_TOKEN_EXPIRATION * 24 * 60 * 60)
  }

  private async verifyRefreshToken(userId: string, refreshToken: string) {
    const key = createHashSha256(refreshToken)
    const token = await this.redis.get(this.REDIS_REFRESH_TOKEN_PREFIX + userId)

    if (token !== key) throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid refresh token' })

    return token
  }
}
