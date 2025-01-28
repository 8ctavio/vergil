import { shallowRef, getCurrentScope, onMounted } from 'vue'
import { extendedRef } from './extendedReactivity/extendedRef'
import { ExtendedReactive, isExtendedRef } from './extendedReactivity'
import { useWatchers } from './useWatchers'
import { watchControlled } from './watchControlled'
import { useResetValue } from "./private/useResetValue"

/**
 * Assesses whether a value is a model created by `useModel`.
 * 
 * @param { any } value
 * @returns { boolean } `true` if `value` is a model created by `useModel`.
 */
export function isModel(value){
    return isExtendedRef(value) && Boolean(value?.__v_isModel)
}

/**
 * Creates a component model.
 * 
 * @param [value] - The initial value to create a model with.
 * @param { {
 *      deep: boolean | number
 * } } options -
 *  - `deep`: Depth of model wrapper watchers.
 * 
 * @returns { ExtendedRef }
 * 
 * @example
 *  ```vue
 *  <script setup>
 *  // Create new model
 *  const model = useModel('initial value')
 *  // Interact with the model value
 *  model.value = 'updated value'
 *  console.log(model.value) // 'updated value'
 *  </script>
 * 
 *  <template>
 *      <!-- Provide model to a component -->
 *      <Component v-model="model"/>
 *  </template>
 *  ```
 */
export function useModel(value) {
    if(isModel(value)) {
        return value
    } else {
        const getResetValue = useResetValue(value)
        const model = extendedRef(getResetValue(), withDescriptor => ({
            el: shallowRef(null),
            exposed: withDescriptor({
                value: new ExtendedReactive(),
                writable: false
            }),
            reset() {
                model.value = getResetValue()
            },
            __v_isModel: withDescriptor({
                value: true,
                enumerable: false,
                writable: false
            })
        }), { configurable: false })
        return model
    }
}

export function useModelWrapper(model, { isCollection = false } = {}) {
    if(!isModel(model))
        return null

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