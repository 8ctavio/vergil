/**
 * @param { any } value 
 * @param { boolean } [isArrayHint] 
 * @returns { boolean }
 */
export function hasDate(value, isArrayHint) {
	return (typeof isArrayHint === 'boolean' ? isArrayHint : Array.isArray(value))
		? value.length > 0
		: isDate(value)
			|| (typeof value === 'string' && value.length > 0)
			|| (typeof value === 'number' && !Number.isNaN(value))
}

/**
 * @param { unknown } value
 * @returns { value is Date }
 */
export function isDate(value) {
	return Object.prototype.toString.call(value) === '[object Date]'
}

/**
 * @param { unknown } value
 * @param { number } [maxLength = 2]
 */
export function padLeadingZeros(value, maxLength = 2) {
	return String(value).padStart(maxLength, '0')
}