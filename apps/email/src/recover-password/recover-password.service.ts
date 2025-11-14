import { TOKENS_CLIENT, USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { createHashSha256 } from '@app/common/utils/create-hash'
import { NewPasswordDto } from '@app/contracts/email/new-password.dto'
import { ResetPasswordDto } from '@app/contracts/email/reset-password.dto'
import { CreateTokenDto } from '@app/contracts/tokens/create-token.dto'
import { Token, TokenType } from '@app/contracts/tokens/token.dto'
import { TOKENS_PATTERNS } from '@app/contracts/tokens/tokens.patterns'
import { User } from '@app/contracts/users/user.dto'
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { v4 } from 'uuid'
import { EmailService } from '../email.service'

@Injectable()
export class RecoverPasswordService {
	constructor(
		@Inject(TOKENS_CLIENT) private readonly tokensClient: ClientProxy,
		@Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
		private readonly emailService: EmailService
	) { }
	public async resetPassword(dto: ResetPasswordDto) {
		const user = await lastValueFrom(this.usersClient.send(USERS_PATTERNS.GET_BY_EMAIL, dto.email))

		if (!user) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'User with this email not found' })

		const token = await this.generate(dto.email)

		// Нет денег на провайдера
		// return this.emailService.sendRecoverPassword(dto.email, token)

		console.log(token)
		return token
	}

	public async newPassword(dto: NewPasswordDto, token: string) {
		const now = new Date()

		const existingToken = await lastValueFrom(this.tokensClient.send<Token>(TOKENS_PATTERNS.FIND, { token, type: TokenType.RESET_PASSWORD }))

		if (!existingToken) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Reset token not found' })

		const isValid = createHashSha256(token) === existingToken.token

		if (!isValid || existingToken.expiresAt < now) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Token invalid or expired' })

		const deletedToken = await lastValueFrom(this.tokensClient.send<{ count: number }>(TOKENS_PATTERNS.DELETE_MANY, {
			id: existingToken.id,
			type: TokenType.RESET_PASSWORD,
			now
		}))

		if (deletedToken.count === 0) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: "Reset token already used or expired" })

		const user = await lastValueFrom(this.usersClient.send<User>(USERS_PATTERNS.GET_BY_EMAIL, existingToken.email))

		if (!user) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: "User not found" })

		return lastValueFrom(this.usersClient.send(USERS_PATTERNS.NEW_PASSWORD, {
			id: user.id,
			dto
		}))
	}

	private async generate(email: string) {
		const token = v4()
		const expiresAt = new Date(new Date().getDate() + 3600 * 1000)

		const existingToken = await lastValueFrom(this.tokensClient.send<Token>(TOKENS_PATTERNS.FIND_BY_EMAIL, { email, type: TokenType.RESET_PASSWORD }))

		if (existingToken) await lastValueFrom(this.tokensClient.send(TOKENS_PATTERNS.DELETE, existingToken.id))

		await lastValueFrom(this.tokensClient.send<Token, CreateTokenDto>(TOKENS_PATTERNS.CREATE, {
			token,
			email,
			expiresAt,
			type: TokenType.RESET_PASSWORD
		}))

		return token
	}
}
