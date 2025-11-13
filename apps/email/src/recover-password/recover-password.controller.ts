import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { NewPasswordDto } from '@app/contracts/email/new-password.dto'
import { ResetPasswordDto } from '@app/contracts/email/reset-password.dto'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { RecoverPasswordService } from './recover-password.service'

@Controller('recover-password')
export class RecoverPasswordController {
  constructor(private readonly recoverPasswordService: RecoverPasswordService) { }

  @MessagePattern(EMAIL_PATTERNS.RESET_PASSWORD)
  public async resetPassword(@Payload() dto: ResetPasswordDto) {
    return this.recoverPasswordService.resetPassword(dto)
  }

  @MessagePattern(EMAIL_PATTERNS.NEW_PASSWORD)
  public async newPassword(@Payload() payload: { dto: NewPasswordDto, token: string }) {
    return this.recoverPasswordService.newPassword(payload.dto, payload.token)
  }
}
