import { Exclude, Expose } from 'class-transformer'
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export enum AuthMethod {
	CREDENTIALS = "CREDENTIALS",
	GOOGLE = "GOOGLE",
	YANDEX = "YANDEX"
}

export enum UserRole {
	ADMIN = 'ADMIN',
	USER = 'USER',
	PREMIUM = 'PREMIUM'
}

export class UserDto {
	@Expose()
	@IsNotEmpty()
	@IsString()
	id?: string

	@Expose()
	@IsEmail()
	email: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	username: string

	@Exclude()
	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols long' })
	password: string

	@Expose()
	@IsString()
	@IsOptional()
	picture?: string | null

	//! That's bad that i use private enum from users/prisma, but i can't figured out how can i solve this problem. I am either have problems with DRY either with this private enum.
	@Expose()
	@IsEnum(AuthMethod)
	authMethod: AuthMethod

	//! Same thing as well as with the authMethod. 
	@Expose()
	@IsOptional()
	@IsEnum(UserRole, {each: true})
	role?: UserRole[]

	@Expose()
	@IsBoolean()
	isVerified: boolean

	@Expose()
	@IsBoolean()
	@IsOptional()
	isTwoFactor?: boolean
}

