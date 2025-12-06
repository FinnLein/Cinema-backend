import { EMAIL_CLIENT } from '@app/common/client-config/clients.constants'
import { ConfirmEmailDto } from '@app/contracts/email/confirm-email.dto'
import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { NewPasswordDto } from '@app/contracts/email/new-password.dto'
import { ResetPasswordDto } from '@app/contracts/email/reset-password.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class EmailService {
	constructor(
		@Inject(EMAIL_CLIENT) private readonly emailClient: ClientProxy
	) { }

	public async confirmEmail(dto: ConfirmEmailDto) {
		return lastValueFrom(this.emailClient.send<unknown, ConfirmEmailDto>(EMAIL_PATTERNS.VERIFY_CONFIRMATION_TOKEN, dto))
	}

	public async resetPassword(dto: ResetPasswordDto) {
		return lastValueFrom(this.emailClient.send<unknown, ResetPasswordDto>(EMAIL_PATTERNS.RESET_PASSWORD, dto))
	}

	public async newPassword(token: string, dto: NewPasswordDto) {
		return lastValueFrom(this.emailClient.send<unknown, {token: string, dto: NewPasswordDto}>(EMAIL_PATTERNS.NEW_PASSWORD, {token, dto}))
	}
}
