import { watch } from 'vue'

/**
 * @import { WatchSource, WatchCallback } from 'vue'
 * @import { WatcherSource, WatcherCallback, WatchUntilOptions, WatchUntilPromise } from '../types'
 */

/**
 * @template T
 * @template { WatchUntilOptions } O
 * @overload
 * @param { WatcherSource<T> } source
 * @param { WatcherCallback<T,true> } callback
 * @param { O } [options = {}]
 * 
 * @returns { WatchUntilPromise<T,O> } 
 */

/**
 * Watches `source` until `callback` returns `true` or another configurable value.
 * 
 * @param { WatchSource | WatchSource[] } source
 * @param { WatchCallback } callback
 * @param { WatchUntilOptions } [options = {}]
 * @returns { Promise<unknown> } A promise. Resolves to the `WatchSource` value that fulfilled the callback. If aborted, the promise rejects with the abort signal's abort reason (`signal.reason`).
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
		timeout = 0,
		signal,
		...watchOptions
	} = options

	if (signal?.aborted) return Promise.reject(signal.reason)

	/** @type { (() => void)[] } */
	const cleanup = []
	const promises = [
		new Promise((resolve, reject) => {
			let immediateStop = false
			const stop = watch(source, (...args) => {
				if (callback(...args) === fulfill) {
					immediateStop = true
					cleanup.forEach(fn => fn())
					resolve(args[0])
				}
			}, {
				...watchOptions,
				immediate: true,
				once: false
			})
			if (immediateStop) stop()
			else {
				cleanup.push(stop)
				if (signal) {
					function abort() {
						cleanup.forEach(fn => fn())
						reject(/** @type { AbortSignal } */(signal).reason)
					}
					signal.addEventListener('abort', abort)
					cleanup.push(() => {
						signal.removeEventListener('abort', abort)
					})
				}
			}
		})
	]

	if (timeout) {
		promises.push(new Promise(resolve => {
			setTimeout(() => {
				cleanup.forEach(fn => fn())
				resolve(undefined)
			}, timeout)
		}))
	}

	return Promise.race(promises)
}