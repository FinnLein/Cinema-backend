import { RegisterDto } from '@app/contracts/auth/register.dto'
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'PasswordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
	validate(repeatPassword: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
		const obj = validationArguments.object as RegisterDto
		return repeatPassword === obj.password
	}
	defaultMessage(validationArguments?: ValidationArguments): string {
		return 'Passwords do not match'
	}
}
