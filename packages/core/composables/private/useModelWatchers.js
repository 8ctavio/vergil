import { watch, effectScope, onScopeDispose, getCurrentScope, getCurrentWatcher } from "vue"
import { watchControlledSync } from "./watchControlledSync"
import { noop } from "../../utilities/private"

const isScheduled = Symbol('isScheduled')

/**
 * Allows to create multiple model watchers and to pause and resume them to ignore model updates.
 * 
 * @template T
 * @param { ExtendedRef<T> } model
 * @param { object } modelMeta
 * @param { boolean } [isCollection]
 * 
 * @returns { [
*	onModelUpdate: (callback: WatchCallback<T>, options: WatchOptions) => (() => void),
 * 	{
 * 		stop: () => void;
 * 		pause: () => void;
 * 		resume: () => void;
 * 	}
 * ] } Model watcher controller
 */
export function useModelWatchers(model, modelMeta, isCollection = false) {
	const composableScope = getCurrentScope()
	const watchers = effectScope(true)
	const syncWatchers = effectScope(true)
	let auxWatcher
	let isPaused = false
	let scheduledEffects = 0

	function onModelUpdate(callback, options = {}) {
		let stop
		if(options.flush === 'sync') {
			syncWatchers.run(() => {
				const watcher = watch(model.ref, (v,u,c) => {
					if(!isPaused) callback(v, u, !modelMeta.hasInteractiveCtx, c)
				}, { ...options, deep: isCollection && 1 })
				if(isPaused) watcher.pause()
				stop = () => watcher()
			})
		} else {
			if(options.immediate && !isPaused) {
				callback(model.value, undefined, false)
				if(options.once) return noop
			}
			
			if(!auxWatcher) {
				effectScope(true).run(() => {
					auxWatcher = watchControlledSync(model.ref, () => {
						for(const effect of watchers.effects) {
							effect[isScheduled] = true
						}
						scheduledEffects = watchers.effects.length
						auxWatcher.pause()
					}, { deep: isCollection && 1 })
				})
			}
			auxWatcher[isPaused ? 'pause' : 'resume']()

			watchers.run(() => {
				const watcher = watch(model.ref, (v,u,c) => {
					const effect = getCurrentWatcher()
					if(effect[isScheduled]) {
						effect[isScheduled] = false
						scheduledEffects--
						if(!isPaused) {
							auxWatcher.resume()
							callback(v, u, !modelMeta.hasInteractiveCtx, c)
							if(options.once) stop()
						}
					}
				}, { flush: options.flush, deep: isCollection && 1 })

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

	return [onModelUpdate, { pause, resume, stop }]
}