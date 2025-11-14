import { TOKENS_CLIENT, USERS_CLIENT } from '@app/common/client-config/clients.constants'
import { createHashSha256 } from '@app/common/utils/create-hash'
import { CreateTokenDto } from '@app/contracts/tokens/create-token.dto'
import { Token, TokenType } from '@app/contracts/tokens/token.dto'
import { TOKENS_PATTERNS } from '@app/contracts/tokens/tokens.patterns'
import { TwoFactorDto } from '@app/contracts/tokens/two-factor.dto'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { EmailService } from '../email.service'

@Injectable()
export class TwoFactorService {
	constructor(
		@Inject(TOKENS_CLIENT) private readonly tokensClient: ClientProxy,
		@Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
		private readonly emailService: EmailService
	) { }

	public async sendToken(email: string) {
		const token = await this.generate(email)

		// Нет денег на провайдера
		// return this.emailService.sendTwoFactor(email, token)

		console.log(token)
		return token
	}

	public async verifyToken(dto: TwoFactorDto) {
		const now = new Date()

		const existingToken = await lastValueFrom(this.tokensClient.send<Token>(TOKENS_PATTERNS.FIND, {
			token: dto.token,
			type: TokenType.TWO_FACTOR
		}))

		if (!existingToken) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Two factor token not found.' })

		const isValid = createHashSha256(dto.token) === existingToken.token

		if (!isValid || existingToken.expiresAt < now) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Token invalid or expired.' })

		const deletedToken = await lastValueFrom(this.tokensClient.send<{ count: number }>(TOKENS_PATTERNS.DELETE_MANY, {
			id: existingToken.id,
			type: TokenType.TWO_FACTOR,
			now
		}))

		if (deletedToken.count === 0) throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Token already used or expired' })

		return true
	}

	private async generate(email: string) {
		const token = Math.floor(Math.random() * (1_000_000 - 100_000) + 100_000).toString()
		const expiresAt = new Date(new Date().getTime() + 300_000)

		const existingToken = await lastValueFrom(this.tokensClient.send<Token>(TOKENS_PATTERNS.FIND_BY_EMAIL, {
			email,
			type: TokenType.TWO_FACTOR
		}))

		if (existingToken) await lastValueFrom(this.tokensClient.send(TOKENS_PATTERNS.DELETE, existingToken.id))

		await lastValueFrom(this.tokensClient.send<Token, CreateTokenDto>(TOKENS_PATTERNS.CREATE, {
			token,
			expiresAt,
			email,
			type: TokenType.TWO_FACTOR
		}))

		return token
	}
}
