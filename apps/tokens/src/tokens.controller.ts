import { CreateTokenDto } from '@app/contracts/tokens/create-token.dto'
import { TokenType } from '@app/contracts/tokens/token.dto'
import { TOKENS_PATTERNS } from '@app/contracts/tokens/tokens.patterns'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { TokensService } from './tokens.service'

@Controller()
export class TokensController {
  constructor(private readonly tokensService: TokensService) { }

  @MessagePattern(TOKENS_PATTERNS.FIND)
  public async find(@Payload() payload: { token: string, type: TokenType }) {
    return this.tokensService.find(payload.token, payload.type)
  }
  @MessagePattern(TOKENS_PATTERNS.FIND_BY_EMAIL)
  public async findByEmail(@Payload() payload: { email: string, type: TokenType }) {
    return this.tokensService.findByEmail(payload.email, payload.type)
  }

  @MessagePattern(TOKENS_PATTERNS.CREATE)
  public async create(@Payload() dto: CreateTokenDto){
    return this.tokensService.create(dto)
  }

  @MessagePattern(TOKENS_PATTERNS.DELETE)
  public async delete(@Payload() id: string){
    return this.tokensService.delete(id)
  }
  @MessagePattern(TOKENS_PATTERNS.DELETE_MANY)
  public async deleteMany(@Payload() payload: {id: string, type: TokenType, now: Date}){
    return this.tokensService.deleteMany(payload.id, payload.type, payload.now)
  }
}
