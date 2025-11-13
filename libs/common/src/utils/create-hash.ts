import { createHash } from 'crypto'

export function createHashSha256(s: string){
	return s ? createHash('sha256').update(s).digest('hex') : ''
}