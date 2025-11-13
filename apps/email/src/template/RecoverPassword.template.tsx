import {
	Body,
	Heading,
	Html,
	Link,
	Tailwind,
	Text
} from '@react-email/components'
import * as React from 'react'

interface IRecoverPassword {
	domain: string
	token: string
}

export function RecoverPasswordTemplate({ domain, token }: IRecoverPassword) {
	const recoverLink = `${domain}/new-password?token=${token}`

	return (
		<Tailwind>
			<Html>
				<Body>
					<Heading>Reset password</Heading>
					<Text>
						In order to change your password please follow the link below
					</Text>
					<Link href={recoverLink}>Change password</Link>
					<Text>
						This link is available within 1 hour. If you did not request change,
						please be aware and change your password.
					</Text>
					<Text>Thanks for using us!</Text>
				</Body>
			</Html>
		</Tailwind>
	)
}
