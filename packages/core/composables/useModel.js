import { ref, isRef, toValue, toRaw } from 'vue'
import { extendedCustomRef } from './extendedRef'
import { isModel } from '../functions'

/**
 * Creates or consumes a component model.
 * 
 * @param [value] - The initial value for a new model. To consume a model, `value` must be a model created by `useModel`.
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
    // Custom component: Wrap model
    if(isModel(value)){
        return extendedCustomRef(value.ref, {
            set: value.updateModel
        },{
            el: value.getRef('el'),
            reset: value.reset,
            onMutated: value.onMutated
        })
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