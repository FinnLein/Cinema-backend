import { Knex } from 'knex'

export interface IJunctionTableInterface {
	trx: Knex.Transaction,
	tableName: string,
	relations: Array<{id?: string}>,
	movieId: string,
	relationField: string
}