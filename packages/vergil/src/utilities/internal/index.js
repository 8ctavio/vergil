/**
 * @param { unknown } value
 * @returns { value is Date }
 */
export function isDate(value) {
	return Object.prototype.toString.call(value) === '[object Date]'
}

/**
 * @param { unknown } value
 * @returns { value is RegExp }
 */
export function isRegExp(value) {
	return Object.prototype.toString.call(value) === '[object RegExp]'
}