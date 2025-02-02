import { customRef, provide, inject, getCurrentScope, onMounted, getCurrentInstance } from 'vue'
import { useWatchers } from './useWatchers'
import { watchControlled } from './watchControlled'
import { useModel, isModel } from './useModel'
import { isExtendedRef } from './extendedReactivity'
import { defineReactiveProperties } from './extendedReactivity/defineReactiveProperties'
import { symModelWatchers } from './private'
import { isFunction, isObject } from '../utilities'

export function isInstanceModel(value) {
    return isObject(value)
        && Object.hasOwn(value, '__v_isInstanceModel')
        && isModel(Object.getPrototypeOf(value))
}

/**
 * Creates component a model wrapper to conveniently implement component's two-way data binding and handle external programmatic mutations.
 * 
 * @param { object } [props] - Component props. The `modelValue`, `onUpdated:modelValue`, and `value` are read from the props object.
 * @param { boolean } [options.isCollection] - Whether the model value may be a collection-like data type (e.g., array, object).
 * 
 * @returns { ExtendedRef }
 * 
 * @example
 *  ```vue
 *  <script setup>
 * 	const props = defineProps({
 * 		modelValue: {
 * 			type: [String, Object],
 * 			default: ''
 * 		},
 * 		['onUpdate:modelValue']: Function
 * 	})
 * 	const model = useDefineModel(props)
 *  </script>
 *  ```
 */
export function useDefineModel(props, options = {}) {
    if(getCurrentInstance()) {
        const {
            isCollection = false,
            captureElements = false,
            captureExposed = false,
            includeElements = true,
            includeExposed = true
        } = options

        const modelCandidate = isObject(props.modelValue)
            ? Object.hasOwn(props.modelValue, '__v_isInstanceModel')
                ? Object.getPrototypeOf(props.modelValue)
                : props.modelValue
            : null
        const isValidModel = modelCandidate !== null
            && Object.hasOwn(modelCandidate, '__v_isModel')
            && isExtendedRef(modelCandidate)
        const model = isValidModel
            ? modelCandidate
            : isFunction(props['onUpdate:modelValue'])
                ? useModel(customRef((track, trigger) => ({
                    get() {
                        track()
                        return props.modelValue
                    },
                    set(v) {
                        props['onUpdate:modelValue'](v)
                        trigger()
                    }
                })), { extendRef: true })
                : useModel(props.modelValue)

        let watcher
        let watchers = inject(symModelWatchers, undefined)
        if(!watchers) {
            watchers = useWatchers(model.ref, {
                deep: isCollection && 1
            })
            provide(symModelWatchers, watchers)
        }

        const ignore = []
        let elements, exposed
        if(includeElements) {
            elements = (captureElements && ((isValidModel && props.modelValue.elements) || props.elements)) || {}
        } else {
            ignore.push('elements')
        }
        if(includeExposed) {
            exposed = (captureExposed && ((isValidModel && props.modelValue.exposed) || props.exposed)) || {}
        } else {
            ignore.push('exposed')
        }
        return defineReactiveProperties(Object.create(model), withDescriptor => ({
            elements: withDescriptor({
                value: elements,
                writable: false
            }),
            exposed: withDescriptor({
                value: exposed,
                writable: false
            }),
            onExternalUpdate(cb, options = {}) {
                if(watcher) watcher.stop()
                if(options.onMounted) {
                    const setupScope = getCurrentScope()
                    onMounted(() => {
                        setupScope.run(() => {
                            watcher = watchControlled(model.ref, cb, {
                                ...options,
                                immediate: true,
                                deep: isCollection && 1
                            })
                        })
                    })
                } else {
                    watcher = watchControlled(model.ref, cb, {
                        ...options,
                        deep: isCollection && 1
                    })
                }
            },
            onExternalMutation: watchers.onUpdated,
            update(v) {
                watcher?.pause()
                watchers.pause()
                try {
                    if(isFunction(v)) {
                        v()
                    } else {
                        model.value = v
                    }
                } finally {
                    watchers.resume()
                    watcher?.resume()
                }
            },
            updateDecorator(fn) {
                return function(...args) {
                    watcher?.pause()
                    watchers.pause()
                    try {
                        return fn.apply(this, args)
                    } finally {
                        watchers.resume()
                        watcher?.resume()
                    }
                }
            },
            __v_isInstanceModel: withDescriptor({
				value: true,
				enumerable: false,
				writable: false
			})
        }), { configurable: false, ignore })
    }
}