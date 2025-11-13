import { Body, Heading, Html, Tailwind, Text } from '@react-email/components'
import * as React from 'react'

interface ITwoFactor {
	token: string
}

export function TwoFactorTemplate({ token }: ITwoFactor) {
	return (
		<Tailwind>
			<Html>
				<Body>
					<Heading>Two factor auth</Heading>
					<Text>
						Your two factor auth code:<strong> {token}</strong>
					</Text>
					<Text>
						Please enter this code in the app to complete the login process.
					</Text>
					<Text>
						If you did not request this code, be aware and change your password.
					</Text>
					<Text>Thanks for using us!</Text>
				</Body>
			</Html>
		</Tailwind>
	)
}
