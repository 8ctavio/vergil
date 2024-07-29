import { ref, isRef, toValue, toRaw } from 'vue'
import { extendedReactive } from './extendedReactive'
import { extendedCustomRef } from './extendedRef'
import { isModel, isModelWrapper } from '../utilities'

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
 *  // Reset the model value
 *  model.reset()
 *  console.log(model.value) // 'initial value'
 *  </script>
 *  <template>
 *      <!-- Provide model to a component -->
 *      <Component v-model="model"/>
 *  </template>
 *  ```
 */
export function useModel(value){
    // Nested custom component: Return wrapped model
    if(isModelWrapper(value)){
        return value
    }
    // Custom component: Wrap model
    else if(isModel(value)){
        return extendedCustomRef(value.ref, {
            set: value.updateModel
        }, withDescriptor => ({
            el: value.getRef('el'),
            reset: value.reset,
            onMutated: value.onMutated,
            __v_isModelWrapper: withDescriptor({
                value: true,
                enumerable: false,
                writable: false
            })
        }))
    }
    // Parent component: Create model
    else {
        const reference = (
            isRef(value)
            || (typeof value !== 'object')
            || value === null
        ) ? value : structuredClone(toRaw(value))
        function getReferenceCopy(){
            const v = toValue(reference)
            return ((typeof v !== 'object') || v === null) ? v : structuredClone(toRaw(v))
        }
        let mutateModel
        return extendedCustomRef(getReferenceCopy(), {
            set(v){
                (mutateModel ?? this.updateModel)(v)
            }
        }, withDescriptor => ({
            el: ref(null),
            reset(){
                this.updateModel(getReferenceCopy())
            },
            exposed: extendedReactive(),
            updateModel: withDescriptor({
                value(v){ this.ref.value = v },
                enumerable: false
            }),
            onMutated: withDescriptor({
                value(callback){
                    if(typeof callback === 'function')
                        mutateModel = callback
                },
                enumerable: false
            }),
            __v_isModel: withDescriptor({
                value: true,
                enumerable: false,
                writable: false
            })
        }))
    }
}