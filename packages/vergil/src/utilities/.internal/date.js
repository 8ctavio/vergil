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