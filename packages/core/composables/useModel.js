import { shallowRef, toRef, isRef } from 'vue'
import { extendedRef } from './extendedReactivity/extendedRef'
import { ExtendedReactive, isExtendedRef } from './extendedReactivity'
import { useResetValue } from "./private/useResetValue"
import { isFunction } from '../utilities'

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
 * @param [value] - Component model's initial value.
 * @param [isShallow] - Whether to use `shallowRef` for the model's internal `value` ref.
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
export function useModel(value, isShallow = false) {
    if(isModel(value)) {
        return value
    } else {
        const modelRef = isRef(value)
            ? value
            : isShallow && !isFunction(value)
                ? shallowRef(value)
                : toRef(value)
                
        const getResetValue = useResetValue(modelRef)
        const model = extendedRef(modelRef, withDescriptor => ({
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