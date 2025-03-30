import { watch, effectScope, onScopeDispose, getCurrentScope, getCurrentWatcher } from "vue"
import { watchControlledSync } from "../reactivity/private"
import { noop } from "../utilities"

const isScheduled = Symbol('isScheduled')

/**
 * Allows to create multiple watchers for the same source and to pause and resume them to ignore source updates.
 * 
 * @template T
 * @param { WatchSource<T> } sources
 * @param { { deep: boolean | number } } options
 * 
 * @returns { {
 * 	stop: () => void;
 * 	pause: () => void;
 * 	resume: () => void;
 * 	ignore: (cb: () => void) => void;
 *	onUpdated: (callback: WatchCallback<T>, options: WatchOptions) => (() => void);
 * } } Watchers handle
 * 
 * @example
 * ```js
 * const source = ref(0)
 * const watchers = useWatchers(source)
 * 
 * // Register callbacks
 * watchers.onUpdated(v => {
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
	const composableScope = getCurrentScope()
	const watchers = effectScope(true)
	const syncWatchers = effectScope(true)
	let auxWatcher
	let isPaused = false
	let scheduledEffects = 0

	function onUpdated(callback, options = {}) {
		let stop
		if(options.flush === 'sync') {
			syncWatchers.run(() => {
				const watcher = watch(sources, (...args) => {
					if(!isPaused) callback(...args)
				}, { ...options, deep })
				if(isPaused) watcher.pause()
				stop = () => watcher()
			})
		} else {
			if(options.immediate && !isPaused) {
				watch(sources, callback, { immediate: true, once: true })
				if(options.once) return noop
			}
			
			if(!auxWatcher) {
				effectScope(true).run(() => {
					auxWatcher = watchControlledSync(sources, () => {
						for(const effect of watchers.effects) {
							effect[isScheduled] = true
						}
						scheduledEffects = watchers.effects.length
						auxWatcher.pause()
					}, { deep })
				})
			}
			auxWatcher[isPaused ? 'pause' : 'resume']()

			watchers.run(() => {
				const watcher = watch(sources, (...args) => {
					const effect = getCurrentWatcher()
					if(effect[isScheduled]) {
						effect[isScheduled] = false
						scheduledEffects--
						if(!isPaused) {
							auxWatcher.resume()
							callback(...args)
							if(options.once) stop()
						}
					}
				}, { flush: options.flush, deep })

				const effect = watchers.effects.at(-1)
				Object.defineProperty(effect, isScheduled, {
					value: false,
					writable: true
				})
				stop = () => {
					watcher()
					if(effect[isScheduled]) {
						effect[isScheduled] = false
						scheduledEffects--
					}
					if(watchers.effects.length === 0) {
						auxWatcher = auxWatcher?.stop()
					}
				}
			})
		}
		if(composableScope !== getCurrentScope()) {
			onScopeDispose(stop, true)
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
			if(watchers.effects.length > scheduledEffects) {
				auxWatcher.resume()
			}
		}
	}
	function ignore(callback) {
		pause()
		try { callback() }
		finally { resume() }
	}
	function stop() {
		for(const effect of watchers.effects) {
			effect[isScheduled] = false
		}
		scheduledEffects = 0
		watchers.stop()
		auxWatcher?.stop()
		syncWatchers.stop()
	}

	onScopeDispose(stop, true)
	
	return {
		onUpdated,
		pause,
		resume,
		ignore,
		stop
	}
}