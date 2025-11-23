import { watch } from 'vue'

/**
 * @import { WatchSource, WatchCallback, WatchOptions, WatchHandle } from 'vue'
 * @import { WatcherSource, WatcherCallback, WatchControlledHandle } from '#reactivity'
 */

/**
 * @template T
 * @template { boolean } [Immediate = false]
 * @overload
 * @param { WatcherSource<T> } source					
 * @param { WatcherCallback<T,Immediate> } callback
 * @param { WatchOptions<Immediate> } [options = {}]
 * 
 * @returns { WatchControlledHandle } 
 */

/**
 * Watcher with pause and resume controls to ignore source updates. Source updates do not trigger a paused watcher.
 * 
 * @param { WatchSource | WatchSource[] } source
 * @param { WatchCallback } callback
 * @param { WatchOptions } [options = {}]
 * 
 * @returns { WatchControlledHandle } Controlled watcher handle
 * 
 * @example
 * ```js
 * const source = ref(0)
 * const watcher = watchControlled(source, v => {
 *     console.log(`new value: ${v}`)	
 * })
 * 
 * // Normally trigger watcher
 * source.value++ // 'new value: 1'
 * 
 * // Ignore updates by pausing watcher
 * watcher.pause()
 * // Does not trigger watcher
 * source.value++
 * watcher.resume()
 * 
 * // Ignore updates with callback
 * watcher.ignore(() => {
 *     // Does not trigger watcher
 *     source.value++
 * })
 * 
 * // Stop watcher
 * watcher.stop()
 * ```
 */
export function watchControlled(source, callback, options = {}) {
	let isPaused = false
	/** @type { boolean | undefined } */
	let isDirty = false
	/** @type { WatchHandle } */
	let watcher
	/** @type { WatchHandle } */
	let syncWatcher

	if (options.flush === 'sync') {
		syncWatcher = watch(source, (...args) => {
			if (!isPaused) callback(...args)
		}, options)
	} else {
		isDirty = options.immediate
		syncWatcher = watch(source, () => {
			if (!isPaused && !isDirty) {
				isDirty = true
				syncWatcher.pause()
			}
		}, {
			flush: 'sync',
			deep: options.deep
		})
		watcher = watch(source, (...args) => {
			if (isDirty) {
				if (isPaused) {
					isDirty = false
				} else {
					syncWatcher.resume()
					isDirty = false
					callback(...args)
				}
			}
			if (options.once) syncWatcher()
		}, options)
	}

	function pause() {
		if (!isPaused) {
			isPaused = true
			syncWatcher.pause()
		}
	}
	function resume() {
		if (isPaused) {
			if (!isDirty) syncWatcher.resume()
			isPaused = false
		}
	}
	/** @param { () => void } callback */
	function ignore(callback) {
		pause()
		try { callback() }
		finally { resume() }
	}

	return {
		pause,
		resume,
		ignore,
		stop() {
			watcher?.()
			syncWatcher()
		}
	}
}