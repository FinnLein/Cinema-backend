import { TOKENS_CLIENT, USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { createHashSha256 } from '@app/common/utils/create-hash'
import { ConfirmEmailDto } from '@app/contracts/email/confirm-email.dto'
import { CreateTokenDto } from '@app/contracts/tokens/create-token.dto'
import { Token, TokenType } from '@app/contracts/tokens/token.dto'
import { TOKENS_PATTERNS } from '@app/contracts/tokens/tokens.patterns'
import { User } from '@app/contracts/users/user.dto'
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { v4 as uuid } from 'uuid'
import { EmailService } from '../email.service'


@Injectable()
export class ConfirmEmailService {
	constructor(
		@Inject(TOKENS_CLIENT) private readonly tokensClient: ClientProxy,
		@Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
		private readonly emailService: EmailService
	) { }

	public async verifyToken(dto: ConfirmEmailDto) {
		const now = new Date()

		const existingToken = await lastValueFrom(this.tokensClient.send<Token>(TOKENS_PATTERNS.FIND, { token: dto.token, type: TokenType.EMAIL_CONFIRMATION }))

		if (!existingToken) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Confirmation token not found' })

		const isValid = createHashSha256(dto.token) === existingToken.token

		if (!isValid || existingToken.expiresAt < now) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Token invalid or expired' })

		const deletedToken = await lastValueFrom(this.tokensClient.send<{ count: number }>(TOKENS_PATTERNS.DELETE_MANY, {
			id: existingToken.id,
			type: TokenType.EMAIL_CONFIRMATION,
			now
		}))

		if (deletedToken.count === 0) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Verification token already used or expired' })

		const user = await lastValueFrom(this.usersClient.send<User>(USERS_PATTERNS.GET_BY_EMAIL, existingToken.email))

		if (!user) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'User not found' })

		return lastValueFrom(this.usersClient.send(USERS_PATTERNS.CONFIRM_EMAIL, user.id))
	}

	public async sendToken(email: string) {
		const token = await this.generate(email)
		// Нет денег для провайдера пока
		// return this.emailService.sendConfirmationToken(verificationToken.email, verificationToken.token)
		console.log(token)
		return true
	}

	private async generate(email: string) {
		const token = uuid()
		const expiresAt = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await lastValueFrom(this.tokensClient.send<Token>(TOKENS_PATTERNS.FIND_BY_EMAIL, { email, type: TokenType.EMAIL_CONFIRMATION }))

		if (existingToken) await lastValueFrom(this.tokensClient.send(TOKENS_PATTERNS.DELETE, existingToken.id))

		await lastValueFrom(this.tokensClient.send<Token, CreateTokenDto>(TOKENS_PATTERNS.CREATE, {
			token,
			email,
			expiresAt,
			type: TokenType.EMAIL_CONFIRMATION,
		}))
		return token
	}
}
