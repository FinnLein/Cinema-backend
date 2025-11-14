import { IsOptional } from 'class-validator'

export const TokenType = {
	RESET_PASSWORD: 'RESET_PASSWORD',
	TWO_FACTOR: 'TWO_FACTOR',
	EMAIL_CONFIRMATION: 'EMAIL_CONFIRMATION'
} as const

export type TokenType = (typeof TokenType)[keyof typeof TokenType]

export class Token {
	@IsOptional()
	id?: string

	token: string
	
	email: string
	
	type: TokenType
	
	expiresAt: Date
}