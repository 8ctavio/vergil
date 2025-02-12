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
        const {
            isCollection = false,
            captureElements = false,
            captureExposed = false,
            includeElements = true,
            includeExposed = true
        } = options

        const { props } = instance
        const rawProps = toRaw(props)

        const modelCandidate = isObject(rawProps.modelValue)
            ? Object.hasOwn(rawProps.modelValue, '__v_isComponentModel')
                ? Object.getPrototypeOf(rawProps.modelValue)
                : rawProps.modelValue
            : null
        const isValidModel = modelCandidate !== null
            && Object.hasOwn(modelCandidate, '__v_isModel')
            && isExtendedRef(modelCandidate)
        const model = isValidModel
            ? modelCandidate
            : isFunction(rawProps['onUpdate:modelValue'])
                ? useModel(customRef((track, trigger) => {
                    let modelValue = rawProps.modelValue

                    watchSyncEffect(() => {
                        const v = props.modelValue
                        if(!Object.is(modelValue, v)) {
                            modelValue = v
                            trigger()
                        }
                    })

                    return {
                        get() {
                            track()
                            return modelValue
                        },
                        set(v) {
                            if(!Object.is(modelValue, v)) {
                                rawProps['onUpdate:modelValue'](v)
                                modelValue = v
                                trigger()
                            }
                        }
                    }
                }), { extendRef: true })
                : useModel(rawProps.modelValue)

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
            elements = (captureElements && ((isValidModel && rawProps.modelValue.elements) || rawProps.elements)) || {}
        } else {
            ignore.push('elements')
        }
        if(includeExposed) {
            exposed = (captureExposed && ((isValidModel && rawProps.modelValue.exposed) || rawProps.exposed)) || {}
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
            __v_isComponentModel: withDescriptor({
				value: true,
				enumerable: false,
				writable: false
			})
        }), { configurable: false, ignore })
    }
}