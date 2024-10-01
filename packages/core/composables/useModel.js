import { ref } from 'vue'
import { defineReactiveProperties } from './defineReactiveProperties'
import { extendedReactive } from './extendedReactive'
import { controlledRef } from './controlledRef'
import { isModel, isModelWrapper } from '../utilities'
import { useResetValue } from "./private/useResetValue"

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
    // Nested custom component: Return wrapped model
    if(isModelWrapper(value)) {
        return value
    }
    // Custom component: Wrap model
    else if(isModel(value)) {
        return Object.create(Object.getPrototypeOf(value), {
            value: {
                get: value.get,
                set: value.updateModel,
            },
            __v_isModelWrapper: { value: true }
        })
    }
    // Parent component: Create model
    else {
        let mutateModel
        const getResetValue = useResetValue(value)
        const modelProto = controlledRef(getResetValue(), {
            set(v) {
                (mutateModel ?? this.updateModel)(v)
            }
        })
        defineReactiveProperties(modelProto, {
            el: ref(null),
            exposed: extendedReactive(),
            updateModel(v) {
                modelProto.set(v, { custom: false })
            },
            reset() {
                modelProto.value = getResetValue()
            },
            onMutated(callback) {
                if(typeof callback === 'function') {
                    mutateModel = callback
                }
            }
        }, { configurable: false })
        return Object.create(modelProto, {
            __v_isModel: { value: true }
        })
    }
}