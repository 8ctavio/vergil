import { watch, effectScope } from 'vue'

/**
 * Watcher with pause and resume controls to ignore source updates. Source updates do not trigger a paused watcher.
 * 
 * @template T
 * @param { WatchSource<T> } sources
 * @param { WatchCallback<T> } callback
 * @param { WatchOptions } options
 * 
 * @returns { {
 * 	stop: () => void;
 * 	pause: () => void;
 * 	resume: () => void;
 * 	ignore: (cb: () => void) => void;
 * } } Controlled watcher handle
 * 
 * @example
 * ```js
 * const source = ref(0)
 * const watcher = watchControlled(source, v => {
 * 	console.log(`new value: ${v}`)	
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
 * 	// Does not trigger watcher
 * 	source.value++
 * })
 * 
 * // Stop watcher
 * watcher.stop()
 * ```
 */
export function watchControlled(sources, callback, options = {}) {
	let isPaused = false
	let isDirty = false
	let syncWatcher

	function pause() {
		if(!isPaused) {
			isPaused = true
			syncWatcher.pause()
		}
	}
	function resume() {
		if(isPaused) {
			if(!isDirty) syncWatcher.resume()
			isPaused = false
		}
	}
	function ignore(callback) {
		pause()
		try { callback() }
		finally { resume() }
	}
	
	const scope = effectScope()
	scope.run(() => {
		if(options.flush === 'sync') {
			syncWatcher = watch(sources, (...args) => {
				if(!isPaused) {
					callback(...args)
				}
			}, options)
		} else {
			isDirty = options.immediate
			syncWatcher = watch(sources, () => {
				if(!isPaused && !isDirty) {
					isDirty = true
					syncWatcher.pause()
				}
			},{
				flush: 'sync',
				deep: options.deep
			})
			watch(sources, (...args) => {
				if(isDirty) {
					if(isPaused) {
						isDirty = false
					} else {
						syncWatcher.resume()
						isDirty = false
						callback(...args)
					}
				}
				if(options.once) scope.stop()
			}, options)
		}
	})
	
	return { stop: scope.stop.bind(scope), pause, resume, ignore }
}