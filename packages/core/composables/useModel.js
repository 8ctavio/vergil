import { provide, hasInjectionContext } from 'vue'
import { isExtendedRef } from './extendedReactivity'
import { extendedRef } from './extendedReactivity/extendedRef'
import { useResetValue, symModelWatchers } from './private'
import { normalizeRef } from '../utilities/private'

/**
 * Assesses whether a value is a model created by `useModel`.
 * 
 * @param { any } value
 * @returns { boolean } `true` if `value` is a model created by `useModel`.
 */
export function isModel(value){
    return isExtendedRef(value) && Boolean(value.__v_isModel)
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
export function useModel(value, options = {}) {
    if(isModel(value)) {
        return value
    } else {
        if(hasInjectionContext()) {
            provide(symModelWatchers, undefined)
        }
        const {
            extendRef = false,
            isShallow = false,
            includeElements = true,
            includeExposed = true,
        } = options
    
        let getResetValue
        if(extendRef) {
            value = normalizeRef(value, isShallow)
            getResetValue = useResetValue(value.value)
        } else {
            getResetValue = useResetValue(value)
            value = normalizeRef(getResetValue(), isShallow)
        }
        
        const proto = extendedRef(value, withDescriptor => {
            const extension = {
                reset() {
                    proto.value = getResetValue()
                },
                __v_isModel: withDescriptor({
                    value: true,
                    enumerable: false,
                    writable: false
                })
            }
            if(includeElements) {
                extension.elements = withDescriptor({
                    value: {},
                    writable: false
                })
            }
            if(includeExposed) {
                extension.exposed = withDescriptor({
                    value: {},
                    writable: false
                })
            }
            return extension
        }, { configurable: false })
        return proto
    }
}