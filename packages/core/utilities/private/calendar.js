export function hasDate(value, isArrayHint) {
	return (typeof isArrayHint === 'boolean' ? isArrayHint : Array.isArray(value))
		? value.length > 0
		: isDate(value)
			|| (typeof value === 'string' && value.length > 0)
			|| (typeof value === 'number' && !Number.isNaN(value))
}

export function isDate(v) {
	return Object.prototype.toString.call(v) === '[object Date]'
}

export function padLeadingZeros(v, maxLength = 2) {
	return String(v).padStart(maxLength, '0')
}