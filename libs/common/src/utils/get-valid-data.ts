export const getValidDataBaseData = (data: Object) => {
	const result = {}
	const keys = Object.keys(data)

	keys.forEach(k => {
		let newKey = ''
		for (const l of k) {
			if (l >= 'A' && l <= 'Z') {
				newKey += '_' + l.toLowerCase()
			} else {
				newKey += l
			}
		}
		result[newKey] = data[k]
	})

	return result
}
