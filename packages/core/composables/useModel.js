import { ref } from 'vue'
import { extendedRef } from './extendedReactivity/extendedRef'
import { ExtendedReactive, isExtendedRef } from './extendedReactivity'
import { useWatchers } from './useWatchers'
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
 * Creates or wraps a component model.
 * 
 * @param [value] - The initial value to create a model with or the model to wrap. Wrapped models are directly returned.
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
export function useModel(value, { deep } = {}){
    if(isModel(value)) {
        if(isModel(Object.getPrototypeOf(value))) {
            // Provider (nested custom component): Return wrapped model
            return value
        } else {
            // Provider (custom component): Wrap model
            return Object.create(value, {
                watchers: { value: useWatchers(value.ref, { deep }) }
            })
                }
        }
    } else {
        // Consumer (parent component): Create model
        const getResetValue = useResetValue(value)
        const model = extendedRef(getResetValue(), withDescriptor => ({
            el: ref(null),
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