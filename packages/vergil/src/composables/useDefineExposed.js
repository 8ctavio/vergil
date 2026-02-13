import { triggerRef, toRaw, watch, getCurrentWatcher, getCurrentInstance, onUnmounted } from "vue"
import { isFunction, isObject } from "#utilities"
import { isModel } from "#composables/useModel"
import { componentInstanceMap, definedExposed, _hasComponent_ } from "#composables/.private/constants"

/**
 * @import { ReactiveEffect, WatchCallback } from 'vue'
 * @import { DefineExposedCallback, InternalExposed } from '#composables'
 * @import { WatcherSource } from '#reactivity'
 */

const _exposedKeys_ = Symbol("exposed-keys")
const patchDescriptor = { configurable: true }
const resetDescriptor = {
	value: undefined,
	writable: false,
	configurable: true
}

/**
 * Defines component's exposed data.
 * 
 * @template T
 * @param { (
 *   | object
 *   | (() => object | null)
 *   | [WatcherSource<T>, DefineExposedCallback<NoInfer<T>>]
 * )[] } sources
 *     Objects whose own enumerable, string-keyed properties are to be exposed,
 *     or effects that return such objects.    
 * 
 * @example
 *  ```js
 *  defineProps({
 *  	exposed: Object
 *  })
 *  useDefineExposed({
 *  	// Properties to expose
 *  })
 *  ```
 */
export function useDefineExposed(...sources) {
	const instance = getCurrentInstance()

	if (!instance || !sources.length) return

	const props = toRaw(instance.props)
	const exposedProxy = (isModel(props.modelValue) && props.modelValue.exposed) || props.exposed

	if (!exposedProxy) return

	const exposedRef = definedExposed.get(exposedProxy)

	if (!exposedRef || exposedRef[_hasComponent_]) return

	let instMeta = componentInstanceMap.get(instance)
	if (!instMeta) componentInstanceMap.set(instance, instMeta = {
		definedExposed: false,
		definedElements: false
	})

	if (instMeta.definedExposed) return

	instMeta.definedExposed = true
	Object.defineProperty(exposedRef, _hasComponent_, {
		value: true,
		writable: true
	})

	// @ts-expect-error
	const exposed = /** @type { typeof exposedRef.value } */ (exposedRef._value)
	const exposedKeys = /** @type { Set<string> } */ (new Set())
	
	/** @param { object | null } source */
	function patchExposed(source) {
		/** @type { (ReactiveEffect & Readonly<{ [_exposedKeys_]?: string[] }>) | undefined} */
		const effect = getCurrentWatcher()
		if (isObject(source)) {
			/** @type { string[] } */
			let sourceKeys
			if (effect) {
				if (!Object.hasOwn(effect, _exposedKeys_)) {
					Object.defineProperty(effect, _exposedKeys_, { value: Object.keys(source) })
				}
				sourceKeys = /** @type { string[] } */(effect[_exposedKeys_])
			} else {
				sourceKeys = Object.keys(source)
			}
			
			for (const key of sourceKeys) {
				exposedKeys.add(key)
				Object.defineProperty(exposed, key, Object.assign(
					/**@type {PropertyDescriptor}*/(Object.getOwnPropertyDescriptor(source, key)),
					patchDescriptor
				))
			}
			triggerRef(/** @type {InternalExposed} */(exposedRef))
		} else if (effect?.[_exposedKeys_]) {
			for (const key of effect[_exposedKeys_]) {
				Object.defineProperty(exposed, key, resetDescriptor)
			}
			triggerRef(/** @type {InternalExposed} */(exposedRef))
		}
	}

	for (const source of sources) {
		if (isFunction(source)) {
			watch(source, patchExposed, { immediate: true })
		} else if (Array.isArray(source)) {
			const [effect, callback] = source
			watch(
				effect, 
				/** @param { Parameters<WatchCallback> } args */
				(...args) => patchExposed(callback(...args)),
				{ immediate: true }
			)
		} else {
			patchExposed(source)
		}
	}
	
	onUnmounted(() => {
		exposedRef[_hasComponent_] = false
		for (const key of exposedKeys.values()) {
			Object.defineProperty(exposed, key, resetDescriptor)
		}
		triggerRef(exposedRef)
	})
}