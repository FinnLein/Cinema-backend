export interface IPaginationResponse<T> {
	data: T[],
	meta: {
		totalCount: number,
		totalPages: number,
		currentPage: number,
		limit: number
	}
}