import { deburr } from "#utilities/string"

/**
 * Formats a string by applying a *formatter* function to its words and joins them with a `separator` string. A **word** is considered as a sequence of alphanumerical characters (including diacritics).
 * 
 * @param { string } str
 * @param { (word: string, idx: number) => string } formatter - Formatter function to apply to every `str` words.
 * @param { string } [separator = ''] - String to join formatted words with. Defaults to `" "`.
 * @returns { string } Formatted string.
 */
export function formatWords(str, formatter, separator = " ") {
	return words(str).reduce((formatedString, word, i) => formatedString + (i ? separator : "") + formatter(word, i), "")
}

/**
 * Converts a string to kebab case. Only alphanumeric characters are considered. Diacritics are removed.
 * 
 * @param { string } str 
 * @returns { string } Kebab cased string.
 * 
 * @example
 * ```js
 * kebabCase('El Cartógrafo Silencioso') // 'el-cartografo-silencioso'
 * ```
 */
export function kebabCase(str) {
	return formatWords(str, word => deburr(word).toLowerCase(), "-")
}

/**
 * Splits a string into an array of its words. A **word** is considered as a sequence of alphanumerical characters (including diacritics).
 * 
 * @param { string } str
 * @returns { string[] } Array of words.
 * 
 * @example
 * ```js
 * words("A Day At The Beach") // ["A", "Day", "At", "The", "Beach"]
 * ```
 */
export function words(str) {
	return str.match(/[\d\p{L}]+/gu) || []
}