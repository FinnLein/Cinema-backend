import { createHash } from 'crypto'

export function createHashSha256(s: string){
	return createHash('sha256').update(s).digest('hex')
}