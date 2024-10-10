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
export function watchControlled(sources, callback, options) {
	const meta = {
		allChanges: 0,
		lastChanges: 0,
		pauseChanges: 0,
		paused: false
	}
	function pause() {
		if(!meta.paused) {
			meta.paused = true
			meta.lastChanges = meta.allChanges
		}
	}
	function resume() {
		if(meta.paused) {
			meta.pauseChanges += meta.allChanges - meta.lastChanges
			meta.paused = false
		}
	}
	function ignore(callback) {
		pause()
		callback()
		resume()
	}
	
	const scope = effectScope()
	scope.run(() => {
		if(options?.flush === 'sync') {
			watch(sources, (...args) => {
				if(!meta.paused) {
					callback(...args)
				}
			}, options)
		} else {
			watch(sources, () => {
				meta.allChanges++
			},{
				flush: 'sync',
				deep: options?.deep
			})
			watch(sources, (...args) => {
				if(meta.allChanges === 0 || meta.allChanges !== meta.pauseChanges) {
					callback(...args)
				}
				meta.allChanges = 0
				meta.pauseChanges = 0
				if(options?.once) scope.stop()
			}, options)
		}
	})
	
	return { stop: scope.stop.bind(scope), pause, resume, ignore }
}