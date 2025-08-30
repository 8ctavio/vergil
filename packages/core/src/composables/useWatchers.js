import { watch, effectScope, onScopeDispose, getCurrentScope, getCurrentWatcher } from "vue"
import { isScheduled } from "#composables"
import { watchControlledSync } from "#reactivity"
import { noop } from "#utilities"

/**
 * @import { WatchSource, WatchCallback, WatchOptions, EffectScope } from 'vue'
 * @import { WatcherSource, WatchersHandle, WatchControls } from '../types'
 * @import { WatcherEffect } from '#composables'
 */

/**
 * @template T
 * @overload
 * @param { WatcherSource<T> } source					
 * @param { { deep?: boolean | number } } [options = {}]
 * @returns { WatchersHandle<T> } 
 */

/**
 * Allows to create multiple watchers for the same source and to pause and resume them to ignore source updates.
 * 
 * @param { WatchSource | WatchSource[] } source
 * @param { { deep?: boolean | number } } [options = {}]
 * @returns { WatchersHandle }
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
export function useWatchers(source, { deep } = {}) {
	const composableScope = getCurrentScope()
	const watchers = /** @type { EffectScope & { effects: WatcherEffect[] } } */ (effectScope(true))
	const syncWatchers = effectScope(true)
	/** @type { WatchControls | void } */
	let auxWatcher
	let isPaused = false
	let scheduledEffects = 0

	/**
	 * @param { WatchCallback } callback
	 * @param { Omit<WatchOptions, 'deep'> } [options = {}]
	 */
	function onUpdated(callback, options = {}) {
		let stop = noop
		if (options.flush === 'sync') {
			syncWatchers.run(() => {
				const watcher = watch(source, (...args) => {
					if (!isPaused) callback(...args)
				}, { ...options, deep })
				if (isPaused) watcher.pause()
				stop = () => watcher()
			})
		} else {
			if (options.immediate && !isPaused) {
				watch(source, callback, { immediate: true, once: true })
				if (options.once) return stop
			}

			if (!auxWatcher) {
				effectScope(true).run(() => {
					auxWatcher = watchControlledSync(source, () => {
						for (const effect of watchers.effects) {
							effect[isScheduled] = true
						}
						scheduledEffects = watchers.effects.length
						;/** @type { WatchControls } */(auxWatcher).pause()
					}, { deep })
				})
			}
			/** @type { WatchControls } */(auxWatcher)[isPaused ? 'pause' : 'resume']()

			watchers.run(() => {
				const watcher = watch(source, (...args) => {
					const effect = /** @type { WatcherEffect } */ (getCurrentWatcher())
					if (effect[isScheduled]) {
						effect[isScheduled] = false
						scheduledEffects--
						if (!isPaused) {
							/** @type { WatchControls } */(auxWatcher).resume()
							callback(...args)
							if (options.once) stop()
						}
					}
				}, { flush: options.flush, deep })

				const effect = /** @type { WatcherEffect } */ (watchers.effects.at(-1))
				Object.defineProperty(effect, isScheduled, {
					value: false,
					writable: true
				})
				stop = () => {
					watcher()
					if (effect[isScheduled]) {
						effect[isScheduled] = false
						scheduledEffects--
					}
					if (watchers.effects.length === 0) {
						auxWatcher = auxWatcher?.stop()
					}
				}
			})
		}
		if (composableScope !== getCurrentScope()) {
			onScopeDispose(stop, true)
		}
		return stop
	}
	function pause() {
		if (!isPaused) {
			isPaused = true
			syncWatchers.pause()
			auxWatcher?.pause()
		}
	}
	function resume() {
		if (isPaused) {
			syncWatchers.resume()
			isPaused = false
			if (watchers.effects.length > scheduledEffects) {
				/** @type { WatchControls } */(auxWatcher).resume()
			}
		}
	}
	/** @param { () => void } callback */
	function ignore(callback) {
		pause()
		try { callback() }
		finally { resume() }
	}
	function stop() {
		for (const effect of watchers.effects) {
			effect[isScheduled] = false
		}
		scheduledEffects = 0
		watchers.stop()
		auxWatcher?.stop()
		syncWatchers.stop()
	}

	onScopeDispose(stop, true)

	return {
		stop,
		pause,
		resume,
		ignore,
		onUpdated,
	}
}