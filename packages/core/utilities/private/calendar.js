export function hasDate(value, isArrayHint) {
	return (typeof isArrayHint === 'boolean' ? isArrayHint : Array.isArray(value))
		? value.length > 0
		: ![null,NaN,''].includes(value)
}

export function isDate(v) {
	return Object.prototype.toString.call(v) === '[object Date]'
}

export function padLeadingZeros(v, maxLength = 2) {
	return String(v).padStart(maxLength, '0')
}