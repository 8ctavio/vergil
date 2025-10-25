/**
 * @import { Debounced } from '#utilities'
 */

// #region ----- STRING -----
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
 * @param { string } str
 * @returns { string } A copy of `str` with the first character capitalized.
 */
export function ucFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
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
// #endregion

// #region ----- OBJECT -----
/**
 * Verifies object keys satisfy required and optional keys specification.
 * 
 * @param { object } obj - Object to perform key verification on.
 * @param { string[] | {
 *     required?: string[];
 *     optional?: string[]; 
 * } } keys - Expected `required` and `optional` keys to be present in the object. Optional keys verification is only performed for `strict = true`. As an array, `keys` represents the required keys only.
 * @param { boolean } [strict = true] - Whether non-required keys are allowed. If optional keys are specified, object's non-required keys must be `optional` keys. Defaults to `true`.
 * @returns { boolean }
 */
export function everyKeyInObject(obj, keys, strict = true) {
	if (!isObject(obj) || !isObject(keys)) return false
	const { required = [], optional = [] } = Array.isArray(keys) ? { required: keys } : keys
	if (!Array.isArray(required) || !Array.isArray(optional)) return false

	const providedKeys = Object.keys(obj)
	const requiredKeys = new Set(required)
	if (providedKeys.length < requiredKeys.size) return false
	if (optional.length && strict) {
		const optionalKeys = new Set(optional).difference(requiredKeys)
		if (providedKeys.length > requiredKeys.size + optionalKeys.size) return false
		let requiredCount = 0
		const keysOK = providedKeys.every(key => requiredKeys.has(key) ? ++requiredCount : optionalKeys.has(key))
		const requiredOK = requiredKeys.size === requiredCount
		return keysOK && requiredOK
	} else {
		return strict && providedKeys.length !== requiredKeys.size
			? false
			: requiredKeys.isSubsetOf(new Set(providedKeys))
	}
}

/**
 * Assesses whether a value is an object.
 * 
 * @param { unknown } value 
 * @returns { value is object } `true` if `value` is an object, and `false` otherwise.
 */
export function isObject(value) {
	return value !== null && typeof value === 'object'
}

/**
 * Assesses whether a value is a plain object.
 * 
 * @param { unknown } value 
 * @returns { value is object } `true` if `value` is a plain object, and `false` otherwise.
 */
export function isPlainObject(value) {
	if (value === null || typeof value !== 'object' || Object.hasOwn(value, Symbol.toStringTag))
		return false

	const proto = Object.getPrototypeOf(value)
	return proto === Object.prototype || proto === null
}
// #endregion

// #region ----- FUNCTION -----
/**
 * Assesses whether a value is a function.
 * 
 * @param { unknown } value 
 * @returns { value is Function } `true` if `value` is a function, and `false` otherwise.
 */
export function isFunction(value) {
	return typeof value === 'function'
}

/**
 * Creates a debounced function.
 * 
 * @param { Function } fn - Function to debounce. 
 * @param { number } minWait - Time in milliseconds to wait before executing `fn` since the debounced function's last call.
 * @param { object } [options = {}]
 * @param { boolean } [options.eager = false] - When set to `true`, `fn` is executed as soon as the debounced function is called *if* `fn` is not scheduled and `minWait` milliseconds have elapsed since `fn`'s last execution (or `fn` has not been executed). Defaults to `false`.
 * 
 * @returns { Debounced } Debounced function with `cancel` method to cancel scheduled `fn` execution.
 */
export function debounce(fn, minWait, options = {}) {
	const { eager = false } = options

	/** @type { Debounced } } */
	let debounced
	/** @type { ReturnType<typeof setTimeout> | undefined } */
	let delay
	if (eager) {
		/** @type { ReturnType<typeof setTimeout> | undefined } */
		let cooldown
		/** @type { (thisArg: unknown, args: unknown[]) => void } */
		const task = (thisArg, args) => {
			fn.apply(thisArg, args)
			clearTimeout(cooldown)
			cooldown = setTimeout(() => cooldown = undefined, minWait)
			delay = undefined
		}
		debounced = /** @type { Debounced } } */ (function(...args) {
			if (delay || cooldown) {
				clearTimeout(delay)
				delay = setTimeout(task, minWait, this, args)
			} else {
				task(this, args)
			}
		})
	} else {
		const task = Function.prototype.apply.bind(fn)
		debounced = /** @type { Debounced } } */ (function(...args) {
			clearTimeout(delay)
			delay = setTimeout(task, minWait, this, args)
		})
	}
	debounced.cancel = () => delay = void clearTimeout(delay)
	return debounced
}
// #endregion

// #region ----- DATE -----
/**
 * Offset a timestamp and/or convert its time unit.
 * 
 * @param { object } [options = {}]					
 * @param { number } [options.from = Date.now()]	- Reference timestamp in milliseconds to get new timestamp from. Defaults to `Date.now()`.
 * @param { 's' | 'ms' } [options.unit = 'ms']		- Time unit to convert reference timestamp to. Defaults to `'ms'`.
 * @param { object } [options.offset = {}] 			- Offset specification. Defaults to `{}`.
 * @param { number } [options.offset.s = 0]			- Offset seconds from reference timestamp. Defaults to `0`.
 * @param { number } [options.offset.m = 0]			- Offset minutes from reference timestamp. Defaults to `0`.
 * @param { number } [options.offset.h = 0]			- Offset hours from reference timestamp. Defaults to `0`.
 * @param { number } [options.offset.d = 0]			- Offset days (24 h) from reference timestamp. Defaults to `0`.
 * 
 * @returns { number } Offset and unit converted timestamp
 */
export function getTimestamp({ from = Date.now(), unit = 'ms', offset = {} } = {}) {
	const { s = 0, m = 0, h = 0, d = 0 } = offset
	const secs = s + (m + (h + d * 24) * 60) * 60
	return Math.trunc(
		unit === 's'
			? (from / 1000) + secs
			: from + (secs * 1000)
	)
}
// #endregion