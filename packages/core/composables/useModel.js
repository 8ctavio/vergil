import { ref, isRef } from 'vue'
import { defineReactiveProperties } from './defineReactiveProperties'
import { extendedReactive } from './extendedReactive'
import { controlledRef } from './controlledRef'
import { ExtendedRef, isModel, isModelWrapper } from '../utilities'
import { useResetValue } from "./private/useResetValue"
import { symSetRef } from '../utilities/private'

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
    if(isModelWrapper(value)) {
        return value
    }
    // Custom component: Wrap model
    else if(isModel(value)) {
        const wrapper = new ExtendedRef(value)
        const descriptors = Object.getOwnPropertyDescriptors(value)
		for(let property in descriptors) {
            if(['__v_skip', 'exposed'].includes(property)) continue
            Object.defineProperty(wrapper, property, descriptors[property])
    		// Set private properties (#refs)
            const refProperty = value.getRef(property)
			if(isRef(refProperty)) wrapper[symSetRef](property, refProperty)
		}

        Object.defineProperties(wrapper, {
            value: {
                get: value.get,
                set: value.updateModel
            },
            __v_isModelWrapper: { value: true }
        })
        return wrapper
    }
    // Parent component: Create model
    else {
        let mutateModel
        const getResetValue = useResetValue(value)
        const model = controlledRef(getResetValue(), {
            set(v) {
                (mutateModel ?? this.updateModel)(v)
            }
        })
        return defineReactiveProperties(model, withDescriptor => ({
            el: ref(null),
            exposed: extendedReactive(),
            updateModel(v) {
                model.set(v, { custom: false })
            },
            reset() {
                model.value = getResetValue()
            },
            onMutated(callback) {
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
    }
}