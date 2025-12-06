import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MediaService {
	private readonly s3: S3Client

	constructor(private readonly config: ConfigService) {
		this.s3 = new S3Client({
			endpoint: config.getOrThrow<string>('S3_ENDPOINT'),
			region: config.getOrThrow<string>('S3_REGION'),
			credentials: {
				accessKeyId: config.getOrThrow<string>('S3_ACCESS_KEY_ID'),
				secretAccessKey: config.getOrThrow<string>('S3_ACCESS_TOKEN')
			}
		})
	}

	public async upload(
		key: string,
		files: Express.Multer.File | Express.Multer.File[]
	) {
		const bucketName = 'cinema-online'
		const uploadedUrls: string[] = []
		for (const file of Array.isArray(files) ? files : [files]) {
			try {
				await this.s3.send(new PutObjectCommand({
					Bucket: bucketName,
					Key: `${key}/${file.originalname}`,
					Body: file.buffer,
					ContentType: file.mimetype,
					ContentLength: file.size,
					ContentDisposition: 'inline'
				}))

				const url = `${this.config.getOrThrow<string>('S3_ENDPOINT')}/${bucketName}/${key}/${file.originalname}`

				uploadedUrls.push(url)
			} catch (error) {
				console.error('Error uploading to S3:', error)
				if (error.Code === 'SignatureDoesNotMatch') {
					throw new ForbiddenException('The request signature we calculated does not match the signature you provided. Check your key and signing method.')
				}
			}
		}
		return uploadedUrls
	}
}
