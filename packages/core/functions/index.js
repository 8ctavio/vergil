import { isRef } from 'vue'

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
 * deburr('México')  // 'Mexico'
 * ```
 */
export function deburr(str){
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

/**
 * Formats numeric string as a 10-digit phone number.
 * 
 * @param { string } phone
 * @returns 10-digit phone number formatted string
 * 
 * @example
 * ```js
 * formatPhone('1234567890')  // '123 456 7890'
 * ```
 */
export function formatPhone(phone){
    return phone.length === 10 ? `${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}` : phone
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
 * kebabCase('El Cartógrafo Silencioso')  // 'el-cartografo-silencioso'
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
 * prune(' Verdad  y   Reconciliación   ')  // 'verdad y reconciliacion'
 * ```
 */
export function prune(str){
    return deburr(spaceEvenly(str)).toLowerCase()
}

/**
 * Converts a string to sentence case. Only alphanumeric characters (including diacritics) are considered.
 * 
 * @param { string } str 
 * @returns Sentence cased string
 * 
 * @example
 * ```js
 * sentenceCase('Assault on the Control Room')  // 'Assault on the control room'
 * ```
 */
export function sentenceCase(str){
    return formatWords(str, (word, i) => i ? word.toLowerCase() : ucFirst(word.toLowerCase()))
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
 * separateThousands(123456789)  // '123,456,789'
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
 * spaceEvenly('  Jane    Doe     ')        // 'Jane Doe'
 * spaceEvenly(' 123   456  789  ', '-')    // '123-456-789'
 * ```
 */
export function spaceEvenly(str, separator = " "){
    return str.trim().replace(/\s+/g, separator)
}

/**
 * Converts a string to start case. Only alphanumeric characters (including diacritics) are considered.
 * 
 * @param { string } str 
 * @returns Start cased string
 * 
 * @example
 * ```js
 * startCase('high charity')  // 'High Charity'
 * ```
 */
export function startCase(str){
    return formatWords(str, word => ucFirst(word.toLowerCase()))
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
 * words('Zacatecas, Zacatecas, México')  // ['Zacatecas', 'Zacatecas', 'México]
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
 * Verifies all provided keys are present in a given object.
 * 
 * @param { object } obj - Object to perform key verification on
 * @param { string[] } required - Array of keys required to be present in `obj`
 * @param { boolean } strict - Whether to admit an object only when the required keys are the only keys in `obj`. Defaults to `true`
 * @returns { boolean }
 * 
 * @example
 * ```js
 * everyKeyInObject({ foo: '', bar: '' }, ['foo'])          // false
 * everyKeyInObject({ foo: '', bar: '' }, ['foo'], false)   // true
 * ```
 */
export function everyKeyInObject(obj, required, strict = true){
    if(obj === null || typeof obj !== 'object') return false
    const keys = Object.keys(obj)
    const requiredSet = new Set(required)
    if(keys.length < requiredSet.size) return false
    if(strict && keys.length !== requiredSet.size) return false
    const iterator = requiredSet.values()
    for(const key of iterator){
        if(!keys.includes(key)) return false
    }
    return true
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
// #endregion

//-----------------------------------------------
//-------------------- ERROR --------------------
//-----------------------------------------------
// #region
/** Class to manage custom app (front-end) errors */
export class AppError{
    /**
     * @param { {
     *      type: string
     *      code: string
     *      details: object
     *      log: string
     *      message: string | { title: string, details: string }
     * } } options -
     * - `type`: Developer defined `AppError` type (e.g. `'server'`)
     * - `code`: Developer defined code. There may be different set of codes for different `type` values
     * - `details`: `type` specific error details
     * - `log`: Message to be logged in the console
     * - `message`: User friendly message. As an object, `message` is separated in a `title` and `details`
     */
    constructor({ type, log, message, code = '', details }){
        this.type = type
        this.message = message
        this.code = code
        this.details = details
        const errorLog = `∮ [AppError: ${type}] — ${log}`
        if(this.type === 'server'){
            console.error(`${errorLog}\n\n`, {
                operation: details.operation,
                code,
                cause: details.cause,
                reason: details.reason
            })
        }
        else console.error(errorLog)
    }
}
// #endregion

//---------------------------------------------
//-------------------- REF --------------------
//---------------------------------------------
// #region
/**
 * Assesses whether a value is a valid watch source.
 * 
 * @param { any } mayBeWatchSource 
 * @returns { boolean } `true` if `mayBeWatchSource` is a valid watch source
 */
export function isWatchSource(mayBeWatchSource){
    return isRef(mayBeWatchSource) || (typeof mayBeWatchSource === 'function')
}
// #endregion