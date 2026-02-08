import { watch } from 'vue'

/**
 * @import { WatchSource, WatchCallback } from 'vue'
 * @import { WatcherSource } from '#types/reactivity/common'
 * @import { WatchUntilOptions, WatchUntilCallback, WatchUntilPromise } from './watchUntil.types'
 */

/**
 * @template T
 * @template { WatchUntilOptions } O
 * @overload
 * @param { WatcherSource<T> } source
 * @param { WatchUntilCallback<T,O> } callback
 * @param { O } [options = {}]
 * 
 * @returns { WatchUntilPromise<T> } 
 */

/**
 * Watches `source` until `callback` returns `true` or another configurable value.
 * 
 * @param { WatchSource | WatchSource[] } source
 * @param { WatchCallback } callback
 * @param { WatchUntilOptions } [options = {}]
 * @returns { Promise<unknown> } A promise. Resolves to the `WatchSource` value that fulfilled the callback. If aborted, the promise is rejected with the abort signal's abort reason (`signal.reason`).
 * 
 * @example
 * ```js
 * watchUnitl(src, (v,u) => {
 *     if (condition(v,u)) {
 *         // ...
 *         return true  // watchUntil resolves to v
 *     }
 * })
 * ```
 */
export function watchUntil(source, callback, options = {}) {
	const {
		fulfill = true,
		signal,
		...watchOptions
	} = options

	if (signal?.aborted) return Promise.reject(signal.reason)

	/** @type { (() => void)[] } */
	return new Promise((resolve, reject) => {
		let immediateStop = false
		let cleanup = () => { immediateStop = true }
		const stop = watch(source, (...args) => {
			if (callback(...args) === fulfill) {
				cleanup()
				resolve(args[0])
			}
		},{
			...watchOptions,
			immediate: true,
			once: false
		})
		if (immediateStop) {
			stop()
		} else if (signal) {
			const abort = () => {
				cleanup()
				reject(signal.reason)
			}
			cleanup = () => {
				stop()
				signal.removeEventListener('abort', abort)
			}
			signal.addEventListener('abort', abort)
		} else {
			cleanup = stop
		}
	})
}