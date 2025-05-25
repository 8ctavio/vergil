import { watch, effectScope, onScopeDispose, getCurrentScope, getCurrentWatcher } from "vue"
import { watchControlledSync } from "../../reactivity/internal"
import { noop } from "../../utilities"

/**
 * @import { WatchOptions, EffectScope, ReactiveEffect } from 'vue'
 * @import { Model, PrivateModel, ExternalModelUpdateCallback, WatchControls } from '../../types'
 */


const isScheduled = Symbol('isScheduled')

/**
 * @typedef { ReactiveEffect & { [isScheduled]?: boolean } } WatcherEffect
 */

export const privateModelMap = new WeakMap()

/**
 * Allows to create multiple model watchers and to pause and resume them to ignore model updates.
 * 
 * @param { Model } model
 * @param { PrivateModel } privateModel
 * @param { boolean } [isCollection = false]
 * 
 * @returns { [
 *	(callback: ExternalModelUpdateCallback, options?: Omit<WatchOptions, 'deep'>) => (() => void),
 * 	WatchControls
 * ] } Model watcher controller
 */
export function useModelWatchers(model, privateModel, isCollection = false) {
	const composableScope = getCurrentScope()
	const watchers = /** @type { EffectScope & { effects: WatcherEffect[] } } */ (effectScope(true))
	const syncWatchers = effectScope(true)
	/** @type { WatchControls | void } */
	let auxWatcher
	let isPaused = false
	let scheduledEffects = 0

	/**
	 * @param { ExternalModelUpdateCallback } callback
	 * @param { Omit<WatchOptions, 'deep'> } [options = {}]
	 */
	function onModelUpdate(callback, options = {}) {
		let stop = noop
		if (options.flush === 'sync') {
			syncWatchers.run(() => {
				const watcher = watch(model.ref, (v, u, c) => {
					if (!isPaused) callback(v, u, !privateModel.hasInteractiveCtx, c)
				}, { ...options, deep: isCollection && 1 })
				if (isPaused) watcher.pause()
				stop = () => watcher()
			})
		} else {
			if (options.immediate && !isPaused) {
				callback(model.value, undefined, false, noop)
				if (options.once) return stop
			}

			if (!auxWatcher) {
				effectScope(true).run(() => {
					auxWatcher = watchControlledSync(model.ref, () => {
						for (const effect of watchers.effects) {
							effect[isScheduled] = true
						}
						scheduledEffects = watchers.effects.length
						;/** @type { WatchControls } */(auxWatcher).pause()
					}, { deep: isCollection && 1 })
				})
			}
			/** @type { WatchControls } */(auxWatcher)[isPaused ? 'pause' : 'resume']()

			watchers.run(() => {
				const watcher = watch(model.ref, (v, u, c) => {
					const effect = /** @type { WatcherEffect } */ (getCurrentWatcher())
					if (effect[isScheduled]) {
						effect[isScheduled] = false
						scheduledEffects--
						if (!isPaused) {
							/** @type { WatchControls } */(auxWatcher).resume()
							callback(v, u, !privateModel.hasInteractiveCtx, c)
							if (options.once) stop()
						}
					}
				}, { flush: options.flush, deep: isCollection && 1 })

				const effect = /** @type { WatcherEffect } */ (watchers.effects.at(-1))
				if (effect) {
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
				} else {
					/**
					 * Effects are not tracked during SSR. 
					 * @See https://vuejs.org/guide/scaling-up/ssr.html#reactivity-on-the-server
					 * Some assumptions for SSR:
					 *   - Watcher callbacks are only executed for `watchEffect` and `watch` with `immediate: true`.
					 *   - Watchers' stop handles are noops
					 */
					stop = () => {
						watcher()
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

	return [onModelUpdate, { pause, resume, stop }]
}