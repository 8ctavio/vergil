/**
 * @param { unknown } value
 * @param { number } [maxLength = 2]
 */
export function padLeadingZeros(value, maxLength = 2) {
	return String(value).padStart(maxLength, '0')
}