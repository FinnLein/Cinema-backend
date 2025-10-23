export interface IBasePrismaClient {
	$connect(): Promise<void>
	$disconnect(): Promise<void>
	$queryRaw(query: TemplateStringsArray, ...args: any[]): Promise<any>
}