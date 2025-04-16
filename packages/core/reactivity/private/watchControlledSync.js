import { watch } from 'vue'

/**
 * @import { WatchSource, WatchCallback, WatchOptions } from 'vue'
 * @import { WatcherSource, WatcherCallback } from '../../types'
 */

/**
 * @typedef { object } WatchControlledSyncHandle
 * @property { () => void } stop
 * @property { () => void } pause
 * @property { () => void } resume
 */

/**
 * @template T
 * @template { boolean } [Immediate = false]
 * @overload
 * @param { WatcherSource<T> } source
 * @param { WatcherCallback<T,Immediate> } callback
 * @param { Omit<WatchOptions<Immediate>, 'flush'> } [options = {}]
 * 
 * @returns { WatchControlledSyncHandle } 
 */

/**
 * @param { WatchSource | WatchSource[] } source
 * @param { WatchCallback } callback
 * @param { Omit<WatchOptions, 'flush'> } options
 * 
 * @returns { WatchControlledSyncHandle }
 */
export function watchControlledSync(source, callback, options = {}) {
	let skip = false
	const watcher = watch(source, (...args) => {
		if(!skip) callback(...args)
	}, { ...options, flush: 'sync' })
	
	return {
		pause: watcher.pause,
		resume() {
			skip = true
			watcher.resume()
			skip = false
		},
		stop: () => watcher()
	}
}