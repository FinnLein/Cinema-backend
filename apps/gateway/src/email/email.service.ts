import { EMAIL_CLIENT } from '@app/common/client-config/clients.constants'
import { ConfirmEmailDto } from '@app/contracts/email/confirm-email.dto'
import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class EmailService {
	constructor(
		@Inject(EMAIL_CLIENT) private readonly emailClient: ClientProxy
	){}

	public async confirmEmail(dto: ConfirmEmailDto){
		return lastValueFrom(this.emailClient.send<unknown, ConfirmEmailDto>(EMAIL_PATTERNS.VERIFY_CONFIRMATION_TOKEN, dto))
	}
}
