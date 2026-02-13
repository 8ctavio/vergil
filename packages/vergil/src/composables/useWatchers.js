import { watch, effectScope, onScopeDispose, getCurrentScope, getCurrentWatcher } from "vue"
import { watchControlledSync } from "#reactivity"
import { noop } from "#utilities"

/**
 * @import { WatchSource, WatchCallback, ReactiveEffect, EffectScope } from 'vue'
 * @import { WatcherSource, WatchersHandle, WatchControls, WatchControlledOptions } from '#reactivity'
 */

/**
 * @template T
 * @overload
 * @param { WatcherSource<T> } source					
 * @param { { deep?: boolean | number } } [options]
 * @returns { WatchersHandle<T> } 
 */

/**
 * Allows to create multiple watchers for the same source and to pause and resume them to ignore source updates.
 * 
 * @param { WatchSource | WatchSource[] } source
 * @param { { deep?: boolean | number } } [options]
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
export function useWatchers(source, options) {
	return new ControlledWatchers(source, options)
}

/**
 * @typedef { ReactiveEffect & { [_isScheduled_]?: boolean } } WatcherEffect
 */

/** Used to mark effects scheduled while watchers are not paused. */
const _isScheduled_ = Symbol('isScheduled')

class ControlledWatchers {
	/** @type { WatchControls | undefined } */
	#auxWatcher
	#watchers = /** @type { EffectScope & { effects: WatcherEffect[] } } */(effectScope(true))
	#syncWatchers = effectScope(true)
	
	#isPaused = false
	#scheduledEffects = 0
	
	#source
	#deep
	#effectScope

	/**
	 * @param { WatchSource | WatchSource[] } source
	 * @param {{ deep?: boolean | number }} [options]
	 */
	constructor(source, { deep } = {}) {
		this.#source = source
		this.#deep = deep
		this.#effectScope = getCurrentScope()
		onScopeDispose(() => this.stop(), true)
	}

	/**
	 * @param { WatchCallback } callback
	 * @param { Omit<WatchControlledOptions, 'deep'> } [options]
	 */
	onUpdated(callback, options = {}) {
		let stop = noop
		
		if (options.flush === 'sync') {
			this.#syncWatchers.run(() => {
				const watcher = watch(this.#source, (...args) => {
					if (this.#isPaused) callback(...args)
				}, { ...options, deep: this.#deep })
				if (this.#isPaused) watcher.pause()
				stop = () => watcher()
			})
		} else {
			if (options.immediate && !this.#isPaused) {
				watch(this.#source, callback, { immediate: true, once: true })
				if (options.once) return stop
			}

			if (!this.#auxWatcher) {
				effectScope(true).run(() => {
					this.#auxWatcher = watchControlledSync(this.#source, () => {
						for (const effect of this.#watchers.effects) {
							effect[_isScheduled_] = true
						}
						this.#scheduledEffects = this.#watchers.effects.length
						auxWatcher.pause()
					}, { deep: this.#deep })
				})
			}
			const auxWatcher = /** @type { WatchControls } */(this.#auxWatcher)
			auxWatcher[this.#isPaused ? 'pause' : 'resume']()

			this.#watchers.run(() => {
				const isNonPreemptive = options.nonPreemptive
				const watcher = watch(this.#source, (...args) => {
					const effect = /** @type { WatcherEffect } */ (getCurrentWatcher())
					if (effect[_isScheduled_]) {
						effect[_isScheduled_] = false
						this.#scheduledEffects--
						
						const isNotPaused = !this.#isPaused
						if (isNotPaused) auxWatcher.resume()
						if (isNotPaused || isNonPreemptive) {
							callback(...args)
							if (options.once) stop()
						}
					}
				}, { flush: options.flush, deep: this.#deep })
				
				const effect = /** @type { WatcherEffect } */ (this.#watchers.effects.at(-1))
				if (effect) {
					Object.defineProperty(effect, _isScheduled_, {
						value: false,
						writable: true
					})
					stop = () => {
						watcher()
						if (effect[_isScheduled_]) {
							effect[_isScheduled_] = false
							this.#scheduledEffects--
						}
						if (this.#watchers.effects.length === 0) {
							this.#auxWatcher = void this.#auxWatcher?.stop()
						}
					}
				} else {
					/**
					 * Effects are not tracked during SSR. 
					 * @see https://vuejs.org/guide/scaling-up/ssr.html#reactivity-on-the-server
					 * Some assumptions for SSR:
					 *   - Watcher callbacks are only executed for `watchEffect` and `watch` with `immediate: true`.
					 *   - Watchers' stop handles are noops
					 */
					stop = () => {
						watcher()
						this.#auxWatcher = void this.#auxWatcher?.stop()
					}
				}
			})
		}

		if (this.#effectScope !== getCurrentScope()) {
			onScopeDispose(stop, true)
		}

		return stop
	}
	
	pause() {
		if (!this.#isPaused) {
			this.#isPaused = true
			this.#syncWatchers.pause()
			this.#auxWatcher?.pause()
		}
	}

	resume() {
		if (this.#isPaused) {
			this.#syncWatchers.resume()
			this.#isPaused = false
			if (this.#watchers.effects.length > this.#scheduledEffects) {
				/** @type { WatchControls } */(this.#auxWatcher).resume()
			}
		}
	}

	stop() {
		for (const effect of this.#watchers.effects) {
			effect[_isScheduled_] = false
		}
		this.#scheduledEffects = 0
		this.#watchers.stop()
		this.#auxWatcher?.stop()
		this.#syncWatchers.stop()
	}

	/** @param { () => void } callback */
	ignore(callback) {
		this.pause()
		try { callback() }
		finally { this.resume() }
	}
}