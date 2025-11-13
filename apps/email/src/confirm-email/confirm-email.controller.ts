import { ConfirmEmailDto } from '@app/contracts/email/confirm-email.dto'
import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ConfirmEmailService } from './confirm-email.service'

@Controller('confirm-email')
export class ConfirmEmailController {
  constructor(private readonly confirmEmailService: ConfirmEmailService) {
  }

  @MessagePattern(EMAIL_PATTERNS.SEND_CONFIRMATION_TOKEN)
  public async sendToken(@Payload() email: string){
    return this.confirmEmailService.sendToken(email)
  }

  @MessagePattern(EMAIL_PATTERNS.VERIFY_CONFIRMATION_TOKEN)
  public async verifyToken(@Payload() dto: ConfirmEmailDto){
    return this.confirmEmailService.verifyToken(dto)
  }
}
