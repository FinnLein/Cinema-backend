import { Public } from '@app/common/decorators/public.decorator'
import { ConfirmEmailDto } from '@app/contracts/email/confirm-email.dto'
import { NewPasswordDto } from '@app/contracts/email/new-password.dto'
import { ResetPasswordDto } from '@app/contracts/email/reset-password.dto'
import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { EmailService } from './email.service'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Public()
  @Post('confirmation')
  @HttpCode(HttpStatus.OK)
  public async confirmEmail(@Body() dto: ConfirmEmailDto) {
    return this.emailService.confirmEmail(dto)
  }

  @Public()
  @Post('password-recovery/reset-password')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.emailService.resetPassword(dto)
  }

  @Public()
  @Post('password-recovery/new-password/:token')
  @HttpCode(HttpStatus.OK)  
  public async newPassword(
    @Body() dto: NewPasswordDto,
    @Param('token') token: string
  ) {
    return this.emailService.newPassword(token, dto)
  }


}
