import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export const getMailerConfig = async (config: ConfigService): Promise<MailerOptions> => ({
	transport: {
		host: config.getOrThrow<string>('SMTP_HOST'),
		port: config.getOrThrow<number>('SMTP_PORT'),
		auth: {
			user: config.getOrThrow<string>('SMTP_LOGIN'),
			pass: config.getOrThrow<string>('SMTP_PASS'),
		}
	},
	defaults: {
		from: 'no-reply@auth1.ru'
	}
})