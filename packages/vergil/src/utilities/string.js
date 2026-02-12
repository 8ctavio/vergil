/**
 * @import { Capitalize } from '#utilities'
 */

/**
 * Removes diacritics from a string.
 * 
 * @param { string } str 
 * @returns { string } `str` without diacritics.
 * 
 * @example
 * ```js
 * deburr('México') // 'Mexico'
 * ```
 */
export function deburr(str) {
	return str.normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

/**
 * Trims, evenly spaces, removes diacritics and lower case a string.
 * 
 * @param { string } str
 * @returns { string } Lower case, diacritic free, evenly spaced version of `str`.
 * 
 * @example
 * ```js
 * prune(' Verdad  y   Reconciliación   ') // 'verdad y reconciliacion'
 * ```
 */
export function prune(str) {
	return deburr(spaceEvenly(str)).toLowerCase()
}

/**
 * Formats a number string by adding a `separator` string between thousands groups of the number's integer part.
 * 
 * @param { string | number } num
 * @param { string } [separator = ','] - String to place between thousands groups. Defaults to `','`.
 * @returns { string } Thousands separated number string.
 * 
 * @example
 * ```js
 * separateThousands(123456789) // '123,456,789'
 * ```
 */
export function separateThousands(num, separator = ',') {
	return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+?(?!\d))/g, separator)
}

/**
 * Trims a string and replaces consecutive white space characters (`/\s+/`) with a single space character (`" "`) or a custom separator string.
 * 
 * @param { string } str
 * @param { string | ((match: string, ...args: any[]) => string) } [separator = " "] - String to replace white space characters with. Defaults to `" "`.
 * @returns { string } Evenly spaced (separated) string.
 * 
 * @example
 * ```js
 * spaceEvenly('  Guilty    Spark     ') // 'Guilty Spark'
 * spaceEvenly(' 123   456  789  ', '-') // '123-456-789'
 * ```
 */
export function spaceEvenly(str, separator = " ") {
	// @ts-expect-error
	return str.trim().replaceAll(/\s{2,}|[^\S ]/g, separator)
}

/**
 * Capitalizes first character of a string.
 * 
 * @template { string } S
 * @overload
 * @param { S } str
 * @returns { Capitalize<S> } A copy of `str` with the first character capitalized.
 * 
 * @param { string } str
 */
export function ucFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}