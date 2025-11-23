import { isDate } from "#utilities"

/**
 * @param { unknown } value 
 * @param { boolean } [isArrayHint] 
 * @returns { boolean }
 */
export function hasDate(value, isArrayHint) {
	return (typeof isArrayHint === 'boolean' ? isArrayHint : Array.isArray(value))
		? /** @type { unknown[] } */ (value).length > 0
		: isDate(value)
			|| (typeof value === 'string' && value.length > 0)
			|| (typeof value === 'number' && !Number.isNaN(value))
}

/**
 * @param { unknown } value
 * @param { number } [maxLength = 2]
 */
export function padLeadingZeros(value, maxLength = 2) {
	return String(value).padStart(maxLength, '0')
}