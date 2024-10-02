import { ref } from 'vue'
import { extendedRef } from './extendedRef'
import { ExtendedReactive, isModel, isModelWrapper } from '../utilities'
import { useResetValue } from "./private/useResetValue"

const onMutated = Symbol('onMutated')

/**
 * Creates or wraps a component model.
 * 
 * @param [value] - The initial value to create a model with or the model to wrap. Wrapped models are directly returned.
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
export function useModel(value){
    // Provider (nested custom component): Return wrapped model
    if(isModelWrapper(value)) {
        return value
    }
    // Provider (custom component): Wrap model
    else if(isModel(value)) {
        const modelProto = Object.getPrototypeOf(value)
        return Object.create(modelProto, {
            value: {
                get: () => modelProto.ref.value,
                set: modelProto.updateModel,
            },
            onMutated: { value: modelProto[onMutated] },
            __v_isModelWrapper: { value: true }
        })
    }
    // Consumer (parent component): Create model
    else {
        let mutateModel
        const getResetValue = useResetValue(value)
        const modelProto = extendedRef(getResetValue(), withDescriptor => ({
            el: ref(null),
            exposed: new ExtendedReactive(),
            updateModel(v) {
                modelProto.ref.value = v
            },
            reset() {
                modelProto.ref.value = getResetValue()
            },
            [onMutated](callback) {
                if(typeof callback === 'function') {
                    mutateModel = callback
                }
            },
            __v_isModel: withDescriptor({
                value: true,
                enumerable: false,
                writable: false
            })
        }), { configurable: false })
        return Object.create(modelProto, {
            value: {
                get: () => modelProto.ref.value,
                set: mutateModel ?? modelProto.updateModel,
            }
        })
    }
}