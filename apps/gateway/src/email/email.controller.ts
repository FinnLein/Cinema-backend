import { ConfirmEmailDto } from '@app/contracts/email/confirm-email.dto'
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { EmailService } from './email.service'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('confirmation')
  @HttpCode(HttpStatus.OK)
  public async confirmEmail(@Body() dto: ConfirmEmailDto){
    return this.emailService.confirmEmail(dto)
  }
}
