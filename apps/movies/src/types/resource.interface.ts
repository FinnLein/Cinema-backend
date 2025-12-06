import { ClientProxy } from '@nestjs/microservices'

export interface IResource {
	movieId?: string,
	field?: string,
	tableName?: string,
	client: ClientProxy,
	clientPattern: string
}