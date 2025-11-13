import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { IBasePrismaClient } from './types/base-prisma-client.types'

@Injectable()
export abstract class BasePrismaService<T extends IBasePrismaClient> implements OnModuleInit, OnModuleDestroy {
	protected abstract readonly logger: Logger
	protected abstract readonly serviceName: string
	protected abstract readonly client: T

	async onModuleInit() {
		const maxRetries = 3
		let retryCount = 0

		while (retryCount < maxRetries) {
			try {
				this.logger.log(`Connecting to database: ${this.serviceName}`)
				await this.client.$connect()
				this.logger.log(`Successfully connected to database: ${this.serviceName}`)
				return
			} catch (error) {
				retryCount++
				this.logger.warn(`Connecting attempts: ${retryCount}. Failed due error: ${error.message}`)
				if (retryCount < maxRetries) {
					const delay = Math.pow(retryCount, 2) * 1000
					this.logger.log(`Retry in ${delay}ms...`)
					await new Promise(resolve => setTimeout(resolve, delay))
				} else {
					this.logger.error('Max connection attempt reached. Started without connection')
					return
				}
			}
		}
	}
	async onModuleDestroy() {
		this.logger.log(`Connecting to database: ${this.serviceName}`)
		await this.client.$connect()
		this.logger.log(`Successfully connected to database: ${this.serviceName}`)
		return
	}
}