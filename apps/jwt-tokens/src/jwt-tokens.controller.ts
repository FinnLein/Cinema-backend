import { JWT_TOKENS_PATTERNS } from '@app/contracts/jwt-tokens/jwt-tokens.patterns'
import { UserRole } from '@app/contracts/users/user.dto'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { JwtTokensService } from './jwt-tokens.service'

@Controller()
export class JwtTokensController {
  constructor(private readonly jwtTokensService: JwtTokensService) { }

  @MessagePattern(JWT_TOKENS_PATTERNS.GENERATE)
  public async generate(@Payload() payload: { id: string, role: UserRole[] }) {
    return this.jwtTokensService.generate(payload.id, payload.role)
  }
  @MessagePattern(JWT_TOKENS_PATTERNS.GET_NEW)
  public async getNew(@Payload() refreshToken: string) {
    return this.jwtTokensService.getNewTokens(refreshToken)
  }
  @MessagePattern(JWT_TOKENS_PATTERNS.BLACKLIST)
  public async blacklist(@Payload() token: string) {
    return this.jwtTokensService.blacklistToken(token)
  }
  @MessagePattern(JWT_TOKENS_PATTERNS.GENERATE)
  public async getHello(@Payload() token) {
    return this.jwtTokensService.checkBlacklistToken(token)
  }
}
