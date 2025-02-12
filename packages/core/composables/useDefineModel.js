import { toRaw, customRef, watchSyncEffect, provide, inject, getCurrentInstance, getCurrentScope, onMounted } from 'vue'
import { useWatchers } from './useWatchers'
import { watchControlled } from './watchControlled'
import { useModel } from './useModel'
import { isExtendedRef } from './extendedReactivity'
import { defineReactiveProperties } from './extendedReactivity/defineReactiveProperties'
import { symModelWatchers } from './private'
import { isFunction, isObject } from '../utilities'

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
export function useDefineModel(options = {}) {
    const instance = getCurrentInstance()
    if(instance) {
        const { isCollection = false } = options
        const capture = {
            elements: options.captureElements ?? false,
            exposed: options.captureExposed ?? false,
        }
        const include = {
            elements: options.includeElements ?? true,
            exposed: options.includeExposed ?? true,
        }

        const { props } = instance
        const rawProps = toRaw(props)
        const { modelValue } = rawProps

        let mayBeComponentModel = false
        const modelCandidate = isObject(modelValue)
            ? (mayBeComponentModel = Object.hasOwn(modelValue, '__v_isComponentModel'))
                ? Object.getPrototypeOf(modelValue)
                : modelValue
            : null
        const isValidModel = modelCandidate !== null
            && Object.hasOwn(modelCandidate, '__v_isModel')
            && isExtendedRef(modelCandidate)
        const model = isValidModel
            ? modelCandidate
            : isFunction(rawProps['onUpdate:modelValue'])
                ? useModel(customRef((track, trigger) => {
                    let value = modelValue

                    watchSyncEffect(() => {
                        const v = props.modelValue
                        if(!Object.is(value, v)) {
                            value = v
                            trigger()
                        }
                    })

                    return {
                        get() {
                            track()
                            return value
                        },
                        set(v) {
                            if(!Object.is(value, v)) {
                                rawProps['onUpdate:modelValue'](v)
                                value = v
                                trigger()
                            }
                        }
                    }
                }), { extendRef: true, includeElements: false, includeExposed: false })
                : useModel(modelValue, {
                    isShallow: true,
                    includeElements: false,
                    includeExposed: false,
                })

        let watcher
        let watchers = inject(symModelWatchers, undefined)
        if(!watchers) {
            watchers = useWatchers(model.ref, {
                deep: isCollection && 1
            })
            provide(symModelWatchers, watchers)
        }

        const componentModel = defineReactiveProperties(Object.create(model), withDescriptor => ({
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
            __v_isComponentModel: withDescriptor({
				value: true,
				enumerable: false,
				writable: false
			})
        }), { configurable: false })

        for(const key of ['elements', 'exposed']) {
            const descriptor = { writable: false }
            if(include[key]) {
                if(capture[key] && isValidModel) {
                    if(mayBeComponentModel && Object.hasOwn(modelValue, key)) {
                        descriptor.value = modelValue[key] ?? rawProps[key] ?? {}
                    } else if(!Object.hasOwn(model, key)) {
                        descriptor.value = rawProps[key] ?? {}
                    }
                } else {
                    descriptor.value = {}
                }
            } else {
                descriptor.value = null
            }
            if(Object.hasOwn(descriptor, 'value')) {
                Object.defineProperty(componentModel, key, descriptor)
            }
        }

        return componentModel
    }
}