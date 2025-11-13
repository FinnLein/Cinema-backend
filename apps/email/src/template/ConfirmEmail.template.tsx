import {
	Body,
	Heading,
	Html,
	Link,
	Tailwind,
	Text
} from '@react-email/components'
import * as React from 'react'

interface IConfirmationProps {
	token: string
	domain: string
}

export function ConfirmEmailTemplate({ domain, token }: IConfirmationProps) {
	const confirmLink = `${domain}/confirm-email?token=${token}`

	return (
		<Tailwind>
			<Html>
				<Body>
					<Heading>Mail confirmation</Heading>
					<Text>
						Hello! In order to complete authentication please follow the link
						below.
					</Text>
					<Link href={confirmLink}>Confirm email</Link>
					<Text>
						This link is available within 1 hour. If you did not request
						confirmation, please be aware and change your password.
					</Text>
					<Text>Thanks for using us!</Text>
				</Body>
			</Html>
		</Tailwind>
	)
}
