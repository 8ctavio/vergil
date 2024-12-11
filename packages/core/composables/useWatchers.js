import { watch, effectScope } from "vue"

/**
 * Allows to create multiple watchers for the same source, and to pause and resume created watchers for their callbacks to ignore source updates.
 * 
 * @template T
 * @param { WatchSource<T> } sources
 * @param { { deep: boolean | number } } options
 * 
 * @returns { {
 * 	onUpdated: (callback: WatchCallback<T>, options: WatchOptions) => (() => void);
 * 	pause: () => void;
 * 	resume: () => void;
 * 	ignore: (cb: () => void) => void;
 * 	stop: () => void;
 * } } Watchers handle
 * 
 * @example
 * ```js
 * const source = ref(0)
 * const watchers = useWatchers(source)
 * 
 * // Register callbacks
 * watchers.create(v => {
 * 	console.log(`new value: ${v}`)
 * })
 * watchers.onUpdated((v,u) => {
 * 	console.log(`old value: ${u}`)
 * })
 * 
 * // Normally trigger watcher callbacks
 * source.value++ // 'new value: 1', 'old value: 0'
 * 
 * // Ignore updates by pausing callbacks
 * watchers.pause()
 * // Does not trigger watcher callbacks
 * source.value++
 * watchers.resume()
 * 
 * // Ignore updates with callback
 * watchers.ignore(() => {
 * 	// Does not trigger watcher callbacks
 * 	source.value++
 * })
 * 
 * // Stop watching
 * watchers.stop()
 * ```
 */
export function useWatchers(sources, { deep } = {}) {
	const watchers = effectScope()
	const syncWatchers = effectScope()
	const scheduledEffects = new WeakSet()
	let auxWatcher
	let isPaused = false
	let scheduledCount = 0 

	function onUpdated(callback, options = {}) {
		let stop
		if(options.flush === 'sync') {
			options.deep = deep
			syncWatchers.run(() => {
				const watchHandle = watch(sources, (...args) => {
					if(!isPaused) callback(...args)
				}, options)
				stop = () => watchHandle()
			})
		} else {
			if(options.immediate) {
				if(!isPaused) {
					watch(sources, callback, { immediate: true, once: true })
				}
				if(options.once) return () => {}
			}
			
			if(!auxWatcher) {
				let skip = false
				const watchHandle = watch(sources, () => {
					if(!skip) {
						for(const effect of watchers.effects) {
							scheduledEffects.add(effect)
						}
						scheduledCount = watchers.effects.length
						auxWatcher.pause()
					}
				}, { flush: 'sync', deep })
				auxWatcher = {
					pause: watchHandle.pause,
					resume: () => {
						skip = true
						watchHandle.resume()
						skip = false
					},
					stop: () => watchHandle()
				}
			}
			auxWatcher[isPaused ? 'pause' : 'resume']()

			watchers.run(() => {
				const watchHandle = watch(sources, (...args) => {
					if(scheduledEffects.delete(effect)) {
						scheduledCount--
						if(!isPaused) {
							auxWatcher.resume()
							callback(...args)
						}
					}
					if(options.once) stop()
				}, { flush: options.flush, deep })

				const effect = watchers.effects.at(-1)

				stop = () => {
					watchHandle()
					if(scheduledEffects.delete(effect)) {
						scheduledCount--
					}
					if(watchers.effects.length === 0) {
						auxWatcher = auxWatcher?.stop()
					}
				}
			})
		}
		return stop
	}
	function pause() {
		if(!isPaused) {
			isPaused = true
			syncWatchers.pause()
			auxWatcher?.pause()
		}
	}
	function resume() {
		if(isPaused) {
			syncWatchers.resume()
			isPaused = false
			if(watchers.effects.length > scheduledCount) {
				auxWatcher.resume()
			}
		}
	}
	function ignore(callback) {
		pause()
		callback()
		resume()
	}
	
	return {
		onUpdated,
		pause,
		resume,
		ignore,
		stop() {
			watchers.stop()
			auxWatcher?.stop()
			syncWatchers.stop()
		}
	}
}