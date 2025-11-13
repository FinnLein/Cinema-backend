import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRATION } from '@app/common/constants/tokens.constant'
import { Injectable } from '@nestjs/common'
import { Response } from 'express'

interface ICookieArgs {
	name: string
	value: string
	httpOnly: boolean
	expires: Date
	res: Response
}

@Injectable()
export class TokensService {

	public async addTokenToResponse(args: ICookieArgs) {
		return args.res.cookie(args.name, args.value, {
			httpOnly: args.httpOnly,
			secure: process.env.NODE_ENV === "dev" ? false : true,
			sameSite: 'lax',
			expires: args.expires,
			domain: 'localhost',
			path: '/'
		})
	}

	public async addRefreshTokenToResponse(token: string, res: Response) {
		const expires = new Date()
		expires.setDate(expires.getDate() + REFRESH_TOKEN_EXPIRATION)

		return this.addTokenToResponse({
			name: REFRESH_TOKEN,
			value: token,
			expires,
			res,
			httpOnly: true
		})
	}

	public async addAccessTokenToResponse(token: string, res: Response) {
		const expires = new Date()
		expires.setMinutes(expires.getMinutes() + ACCESS_TOKEN_EXPIRATION)

		return this.addTokenToResponse({
			name: ACCESS_TOKEN,
			value: token,
			expires,
			res,
			httpOnly: false
		})
	}

	public async removeTokenFromResponse(res: Response) {
		res.clearCookie(REFRESH_TOKEN)
		res.clearCookie(ACCESS_TOKEN)
	}
}

