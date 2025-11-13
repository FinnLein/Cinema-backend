import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { TwoFactorDto } from '@app/contracts/tokens/two-factor.dto'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { TwoFactorService } from './two-factor.service'

@Controller('two-factor')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @MessagePattern(EMAIL_PATTERNS.SEND_2FA)
  public async sendToken(@Payload() email: string){
    return this.twoFactorService.sendToken(email)
  }

  @MessagePattern(EMAIL_PATTERNS.VERIFY_2FA)
  public async verifyToken(@Payload() dto: TwoFactorDto){
    return this.twoFactorService.verifyToken(dto)
  }
}
