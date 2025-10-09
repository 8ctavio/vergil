import { watchUntil } from '#reactivity'
import { isWatchSource } from '#utilities'

/**
 * @import { MaybeRefOrGetter, WatchSource, WatchCallback } from 'vue'
 * @import { WatcherSource, WatchUntilOptions, WaitForMethods } from '#reactivity'
 */

/**
 * @template { WatchSource | WatchSource[] } T
 * @template { Omit<WatchUntilOptions, 'fulfill'> } O
 * @overload
 * @param { WatcherSource<T> } source
 * @param { O } [options]
 * 
 * @returns { WaitForMethods<T,O> } 
 */

/**
 * Watches `source` until a condition is fulfilled. The condition can be specified as a chained method.
 * 
 * @param { WatchSource | WatchSource[] } source 
 * @param { Omit<WatchUntilOptions, 'fulfill'> } [options]
 * 
 * @returns { WaitForMethods }
 * 
 * @example
 * ```js
 * waitFor(src).toBe(true).then(() => {
 *      // Do something when toValue(src) === true
 * })
 * 
 * // Wait until [1,2,3].includes(toValue(src))
 * await waitFor(src).toBeIn([1,2,3])
 * 
 * // Wait until toValue(src) !== null
 * await waitFor(src).not.toBe(null)
 * ```
 */
export function waitFor(source, options) {
	return methodsGenerator(source, { ...options, fulfill: true })
}

/**
 * @param { WatchSource | WatchSource[] } source
 * @param { WatchUntilOptions & { fulfill: boolean } } options
 * @returns { WaitForMethods }
 */
function methodsGenerator(source, options) {
	/** @param { WatchCallback } condition */
	function toMatch(condition) {
		return watchUntil(source, condition, options)
	}

	const methods = /** @type { WaitForMethods<WatchSource> & WaitForMethods<WatchSource[]> } */ ({ toMatch })

	if (options.fulfill) methods.toChange = ((times = 1) => {
		let cont = 0
		if (isWatchSource(times)) {
			const sources = Array.isArray(source) ? [times, ...source] : [times, source]
			return watchUntil(sources, (v,u) => {
				for (let i=1; i<v.length; i++) {
					if (!Object.is(v[i], u[i])) {
						cont++
						break
					}
				}
				return cont > v[0]
			}, options)
		} else {
			return toMatch(() => ++cont > times)
		}
	})

	if (Array.isArray(source)) {
		methods.toBeEqual = () => watchUntil(source, ([v1, ...v2]) => v2.every(v => v === v1), options)
	} else {
		/** @param { MaybeRefOrGetter } value */
		methods.toBe = value => {
			return isWatchSource(value)
				? watchUntil([source, value], ([src, v]) => src === v, options)
				: toMatch(src => src === value)
		}
		/** @param { MaybeRefOrGetter<unknown[]> } value */
		methods.toBeIn = value => {
			return isWatchSource(value)
				? watchUntil([source, value], ([src, v]) => Array.isArray(v) && v.includes(src), options)
				: toMatch(src => value.includes(src))
		}
		methods.toBeTruthy = () => toMatch(Boolean)
		methods.toBeNaN = () => toMatch(Number.isNaN)
		/** @param { MaybeRefOrGetter } value */
		methods.toContain = value => {
			return isWatchSource(value)
				? watchUntil([source, value], ([src, v]) => Array.isArray(src) && src.includes(v), options)
				: toMatch(src => src.includes(value))
		}
	}

	if (options.fulfill) Object.defineProperty(methods, 'not', {
		get() {
			return methodsGenerator(source, { ...options, fulfill: false })
		}
	})

	return methods
}