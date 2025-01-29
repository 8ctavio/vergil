import { customRef, getCurrentScope, onMounted } from 'vue'
import { useWatchers } from './useWatchers'
import { watchControlled } from './watchControlled'
import { useModel, isModel } from './useModel'

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
 * 	const model = useModelWrapper(props)
 *  </script>
 *  ```
 */
export function useModelWrapper(props, { isCollection = false } = {}) {
	const model = isModel(props.modelValue)
		? props.modelValue
		: useModel(
			typeof props['onUpdate:modelValue'] === 'function'
				? customRef((track, trigger) => ({
					get() {
						track()
						return props.modelValue
					},
					set(v) {
						props['onUpdate:modelValue'](v)
						trigger()
					}
				}))
				: props.modelValue
		)

    let proto
    let watcher
    if(Object.hasOwn(model, '__v_isModelWrapper')) {
        proto = Object.getPrototypeOf(model)
    } else {
        const watchers = useWatchers(model.ref, {
            deep: isCollection && 1
        })
        proto = Object.create(model, {
            watchers: { value: watchers },
            onExternalMutation: {
                value: watchers.onUpdated,
                enumerable: true
            }
        })
    }

    return Object.create(proto, {
        onExternalUpdate: {
            value: (cb, options = {}) => {
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
            enumerable: true
        },
        update: {
            value: v => {
                watcher?.pause()
                proto.watchers.pause()
                try {
                    if(typeof v === 'function') {
                        v()
                    } else {
                        model.value = v
                    }
                } finally {
                    proto.watchers.resume()
                    watcher?.resume()
                }
            },
            enumerable: true
        },
        updateDecorator: {
            value: fn => {
                return function(...args) {
                    watcher?.pause()
                    proto.watchers.pause()
                    try {
                        return fn.apply(this, args)
                    } finally {
                        proto.watchers.resume()
                        watcher?.resume()
                    }
                }
            },
            enumerable: true
        },
        __v_isModelWrapper: {
            value: true
        }
    })
}