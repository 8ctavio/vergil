//------------------------------------------------
//-------------------- STRING --------------------
//------------------------------------------------
// #region
/**
 * Removes diacritics from a string.
 * 
 * @param { string } str 
 * @returns { string } `str` without diacritics
 * 
 * @example
 * ```js
 * deburr('México') // 'Mexico'
 * ```
 */
export function deburr(str){
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

/**
 * Formats a string by applying a *formatter* function to its words and joins them with a `separator` string. A **word** is considered as a sequence of alphanumerical characters (including diacritics).
 * 
 * @param { string } str
 * @param { function } formatter - Formatter function to apply to every `str` words
 * @param { string } separator - String to join formatted words with. Defaults to `" "`
 * @returns { string } Formatted string
 */
export function formatWords(str, formatter, separator = " "){
    return words(str).reduce((formatedString, word, i) => formatedString + (i?separator:"") + formatter(word, i), "")
}

/**
 * Converts a string to kebab case. Only alphanumeric characters are considered. Diacritics are removed.
 * 
 * @param { string } str 
 * @returns Kebab cased string
 * 
 * @example
 * ```js
 * kebabCase('El Cartógrafo Silencioso') // 'el-cartografo-silencioso'
 * ```
 */
export function kebabCase(str){
    return formatWords(str, word => deburr(word).toLowerCase(), "-")
}

/**
 * Trims, evenly spaces, removes diacritics and lower case a string.
 * 
 * @param { string } str
 * @returns { string } Lower case, diacritic free, evenly spaced version of `str`
 * 
 * @example
 * ```js
 * prune(' Verdad  y   Reconciliación   ') // 'verdad y reconciliacion'
 * ```
 */
export function prune(str){
    return deburr(spaceEvenly(str)).toLowerCase()
}

/**
 * Formats a number string by adding a `separator` string between thousands groups of the number's integer part.
 * 
 * @param { string | number } num
 * @param { string } separator - String to place between thousands groups. Defaults to `','`
 * @returns Thousands separated number string
 * 
 * @example
 * ```js
 * separateThousands(123456789) // '123,456,789'
 * ```
 */
export function separateThousands(num, separator = ','){
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+?(?!\d))/g, separator)
}

/**
 * Trims a string and replaces consecutive white space characters (`/\s+/`) with a single space character (`" "`) or a custom separator string.
 * 
 * @param { string } str
 * @param { string } separator - String to replace white space characters with. Defaults to `" "`.
 * @returns { string } Evenly spaced (separated) string
 * 
 * @example
 * ```js
 * spaceEvenly('  Guilty    Spark     ') // 'Guilty Spark'
 * spaceEvenly(' 123   456  789  ', '-') // '123-456-789'
 * ```
 */
export function spaceEvenly(str, separator = " "){
    return str.trim().replaceAll(/\s{2,}|[^\S ]/g, separator)
}

/**
 * Capitalizes first character of a string.
 * 
 * @param { string } str
 * @returns { string } `str` with its first character capitalized
 */
export function ucFirst(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Splits a string into an array of its words. A **word** is considered as a sequence of alphanumerical characters (including diacritics).
 * 
 * @param { string } str
 * @returns { string[] } Array of words
 * 
 * @example
 * ```js
 * words("A Day At The Beach") // ["A", "Day", "At", "The", "Beach"]
 * ```
 */
export function words(str){
    return str.match(/[\d\p{L}]+/gu) || []
}
// #endregion

//------------------------------------------------
//-------------------- OBJECT --------------------
//------------------------------------------------
// #region
/**
 * Verifies object keys satisfy required and optional keys specification.
 * 
 * @param { object } obj - Object to perform key verification on.
 * @param { string[] | {
 *  required?: string[];
 *  optional?: string[]; 
 * } } keys - Expected `required` and `optional` keys to be present in the object. Optional keys verification is only performed for `strict = true`. As an array, `keys` represents the required keys only.
 * @param { boolean } strict - Whether non-required keys are allowed. If optional keys are specified, object's non-required keys must be `optional` keys. Defaults to `true`.
 * @returns { boolean }
 * 
 * @example
 * ```js
 * everyKeyInObject({ foo: '' }, ['foo'])                   // true
 * everyKeyInObject({ foo: '', bar: '' }, ['foo'])          // false
 * everyKeyInObject({ foo: '', bar: '' }, ['foo'], false)   // true
 * ```
 * 
 * @example
 *  ```js
 *  everyKeyInObject({ foo: '', bar: '', baz: '' }, {   // false
 *      required: ['foo'],
 *      optional: ['bar']
 *  })
 *  everyKeyInObject({ foo: '', bar: '', baz: '' }, {   // true
 *      required: ['foo'],
 *      optional: ['bar', 'baz']
 *  })
 *  everyKeyInObject({ bar: '' }, {                     // true
 *      optional: ['foo', 'bar', 'baz']
 *  })
 * ```
 */
export function everyKeyInObject(obj, keys, strict = true){
    if(obj === null || typeof obj !== 'object') return false
    if(keys === null || typeof keys !== 'object') return false
    const { required = [], optional = [] } = Array.isArray(keys) ? { required: keys } : keys
    if(!Array.isArray(required) || !Array.isArray(optional)) return false

    const providedKeys = Object.keys(obj)
    const requiredKeys = new Set(required)
    if(providedKeys.length < requiredKeys.size) return false
    if(optional.length && strict){
        const optionalKeys = new Set(optional).difference(requiredKeys)
        if(providedKeys.length > requiredKeys.size + optionalKeys.size) return false
        let requiredCount = 0
        const keysOK = providedKeys.every(key => requiredKeys.has(key) ? ++requiredCount : optionalKeys.has(key))
        const requiredOK = requiredKeys.size === requiredCount
        return keysOK && requiredOK
    } else {
        if(strict && providedKeys.length !== requiredKeys.size) return false
        return requiredKeys.isSubsetOf(providedKeys)
    }
}

/**
 * Assesses whether a value is an object.
 * 
 * @param { any } value 
 * @returns { boolean } `true` if `value` is an object.
 */
export function isObject(value){
    return value !== null && typeof value === 'object'
}

/**
 * Assesses whether a value is a plain object.
 * 
 * @param { any } value 
 * @returns { boolean } `true` if `value` is a plain object.
 */
export function isPlainObject(value) {
    if(value === null || typeof value !== 'object' || Object.hasOwn(value, Symbol.toStringTag))
        return false

	const proto = Object.getPrototypeOf(value)
    return proto === Object.prototype || proto === null
}
// #endregion

//--------------------------------------------------
//-------------------- FUNCTION --------------------
//--------------------------------------------------
// #region
/**
 * Assesses whether a value is a function.
 * 
 * @param { any } value 
 * @returns { boolean } `true` if `value` is a function.
 */
export function isFunction(value){
    return typeof value === 'function'
}

/**
 * Creates a debounced function.
 * 
 * @param { function } fn - Function to debounce. 
 * @param { number } minWait - Time in milliseconds to wait before executing `fn` since the debounced function's last call.
 * @param { boolean } [options.eager] - When set to `true`, `fn` is executed as soon as the debounced function is called *if* `fn` is not scheduled and `minWait` milliseconds have elapsed since `fn`'s last execution (or `fn` has not been executed). Defaults to `false`.
 * 
 * @returns { function } Debounced function with `cancel` method to cancel scheduled `fn` execution.
 */
export function debounce(fn, minWait, options = {}) {
    const { eager = false } = options
    
    let debounced, delay
    if(eager) {
        let cooldown
        const task = (thisArg, args) => {
            fn.apply(thisArg, args)
            clearTimeout(cooldown)
            cooldown = setTimeout(() => cooldown = undefined, minWait)
            delay = undefined
        }
        debounced = function(...args) {
            if(delay || cooldown) {
                clearTimeout(delay)
                delay = setTimeout(task, minWait, this, args)
            } else {
                task(this, args)
            }
        }
    } else {
        const task = Function.prototype.apply.bind(fn)
        debounced = function(...args) {
            clearTimeout(delay)
            delay = setTimeout(task, minWait, this, args)
        }
    }
    debounced.cancel = () => delay = void clearTimeout(delay)
    return debounced
}
// #endregion

//----------------------------------------------
//-------------------- DATE --------------------
//----------------------------------------------
// #region
/**
 * Offset a timestamp and/or convert its time unit.
 * 
 * @param { {
 *  from: number;
 *  unit: 's' | 'ms';
 *  offset: {
 *      s: number;
 *      m: number;
 *      h: number;
 *      d: number;
 *  };
 * } } options -
 *  - `from`: Reference timestamp in milliseconds to get new timestamp from. Defaults to `Date.now()`
 *  - `unit`: Time unit to convert reference timestamp to. Defaults to `'ms'`
 *  - `offset`: Offset specification. Defaults to `{}`
 *      - `s`: Offset seconds from reference timestamp
 *      - `m`: Offset minutes from reference timestamp
 *      - `h`: Offset hours from reference timestamp
 *      - `d`: Offset days (24 h) from reference timestamp
 * @returns { number } Offset and unit converted timestamp
 * 
 * @example
 * ```js
 *  // The returned timestamp is in seconds and is of 5 days before today at 2 hours, 5 minutes, 30 seconds from now's time
 *  getTimestamp({
 *      from: Date.now(),
 *      units: 's',
 *      offset: {
 *          s: 30,
 *          m: 5,
 *          h: 2,
 *          d: -5
 *      }
 *  })
 * ```
 */
export function getTimestamp({ from = Date.now(), unit = 'ms', offset = {} } = {}){
    const { s = 0, m = 0, h = 0, d = 0 } = offset
    const delta = (s + (m + (h + d*24)*60)*60)*1000
    return Math.floor((from + delta)/({s: 1000, ms: 1}[unit]))
}

/**
 * Gets a start of day timestamp (00:00:00.000) of another timestamps' date in a given timezone.
 * 
 * @param { number } tzo - Timezone offset in minutes 
 * @param { number } timestamp - Reference timestamp in milliseconds. Defaults to `Date.now()`
 * @returns { number } Start-of-day timestamp of the target-timezone-date with the provided timestamp
 */
export function getDayStart(tzo, timestamp = Date.now()){
    const dayUTC = new Date(getTimestamp({
        from: timestamp,
        offset: { d: Math.sign(-tzo), m: tzo } 
    }))
    dayUTC.setUTCHours(0,0,0,0)
    return getTimestamp({
        from: dayUTC.getTime(),
        offset: { d: Math.sign(tzo), m: -tzo } 
    })
}
// #endregion

export { isWatchSource } from './reactivity'