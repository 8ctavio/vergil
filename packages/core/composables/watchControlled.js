import { watch, effectScope } from 'vue'

/**
 * 
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
 * } } Watch controller.
 * 
 * @example
 * ```js
 * const source = ref(0)
 * const controller = watchControlled(source, v => {
 * 	console.log(`new value: ${v}`)	
 * })
 * 
 * // Normally trigger watch
 * source.value++ // 'new value: 1'
 * 
 * // Ignore updates while paused
 * controller.pause()
 * // Does not trigger watch
 * source.value++
 * controller.resume()
 * 
 * // Ignore updates with callback
 * controller.ignore(() => {
 * 	// Does not trigger watch
 * 	source.value++
 * })
 * 
 * // Stop watcher
 * controller.stop()
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
		callback()
		resume()
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
				if(!isPaused && isDirty) {
					callback(...args)
					syncWatcher.resume()
				}
				isDirty = false
				if(options.once) scope.stop()
			}, options)
		}
	})
	
	return { stop: scope.stop.bind(scope), pause, resume, ignore }
}