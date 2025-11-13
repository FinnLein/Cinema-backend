import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import { ConfirmEmailTemplate } from './template/ConfirmEmail.template'
import { RecoverPasswordTemplate } from './template/RecoverPassword.template'
import { TwoFactorTemplate } from './template/TwoFactor.template'

@Injectable()
export class EmailService {
  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService
  ) { }

  get domain() {
    return this.config.getOrThrow<string>('ALLOWED_ORIGIN')
  }

  public async sendConfirmEmail(email: string, token: string) {
    const html = await render(ConfirmEmailTemplate({ domain: this.domain, token }))
    return this.sendMail(email, html, 'Email confirmation')
  }

  public async sendRecoverPassword(email: string, token: string) {
    const html = await render(RecoverPasswordTemplate({ domain: this.domain, token }))
    return this.sendMail(email, html, 'Password recover')
  }

  public async sendTwoFactor(email: string, token: string){
    const html = await render(TwoFactorTemplate({token}))
    return this.sendMail(email, html, 'Two factor auth')
  }

  private sendMail(email: string, html: string, subject: string) {
    return this.mailer.sendMail({
      to: email,
      html,
      subject
    })
  }
}
