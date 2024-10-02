import { ref } from 'vue'
import { extendedCustomRef } from './extendedRef'
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
        const model = value
        return Object.create(model, {
            value: {
                get: () => model.ref.value,
                set: model.updateModel,
            },
            onMutated: { value: model[onMutated] },
            __v_isModelWrapper: { value: true }
        })
    }
    // Consumer (parent component): Create model
    else {
        let mutateModel
        const getResetValue = useResetValue(value)
        const model = extendedCustomRef(getResetValue(), {
            set: v => (mutateModel ?? model.updateModel)(v)
        }, withDescriptor => ({
            el: ref(null),
            exposed: withDescriptor({
                value: new ExtendedReactive(),
                writable: false
            }),
            updateModel(v) {
                model.ref.value = v
            },
            reset() {
                model.ref.value = getResetValue()
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
        return model
    }
}