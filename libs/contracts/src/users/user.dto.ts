import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export const AuthMethod = {
	CREDENTIALS: "CREDENTIALS",
	GOOGLE: "GOOGLE",
	YANDEX: "YANDEX"
} as const

export type AuthMethod = (typeof AuthMethod)[keyof typeof AuthMethod]

export const UserRole = {
	ADMIN: 'ADMIN',
	USER: 'USER',
	PREMIUM: 'PREMIUM'
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export class User {
	@IsNotEmpty()
	@IsString()
	@IsOptional()
	id?: string

	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	username: string

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols long' })
	password: string

	@IsString()
	@IsOptional()
	picture?: string | null

	//! That's bad that i use private enum from users/prisma, but i can't figured out how can i solve this problem. I am either have problems with DRY either with this private enum.

	@IsEnum(AuthMethod)
	method: AuthMethod

	//! Same thing as well as with the authMethod. 

	@IsOptional()
	@IsEnum(UserRole, { each: true })
	role?: UserRole[]

	@IsBoolean()
	isVerified: boolean

	@IsBoolean()
	@IsOptional()
	isTwoFactor?: boolean
}

