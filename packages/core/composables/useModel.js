import { isRef, triggerRef, customRef } from 'vue'
import { useElements, useExposed, defineReactiveProperties } from '.'
import { isExtendedRef } from './extendedReactivity'
import { extendedRef } from './extendedReactivity/extendedRef'
import { useResetValue } from './private'
import { isFunction } from '../utilities'
import { normalizeRef, shallowCopy, looselyEqual, noop, getTrue, getFalse, uniqueKey } from '../utilities/private'

function getError() {
    return this.errors.value.length > 0
}
function clearError() {
    this.errors.value.length = 0
    triggerRef(this.errors)
}

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
 * @param { {
 *      shallow: boolean;
 *      extendRef: boolean;
 *      includeElements: boolean;
 *      includeExposed: boolean;
 * } } options -
 *  - `shallow`: Whether to use `shallowRef` for the model's internal `ref` object. Defaults to `false`.
 *  - `extendRef`: If `value` is a ref, whether to use the provided ref itself as the extendedRef's underlying `ref` object. When set to `false`, the `value` ref is instead used as the dynamic source of reset values. When set to `true`, the reset value will be the `value` ref's initial value. Defaults to `false`.
 *  - `includeExposed`/`includeElements`: Whether to include the `exposed`/`elements` object into the model. Defaults to `true`.
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
        const {
            shallow = false,
            extendRef = false,
            validator = null,
            includeElements = true,
            includeExposed = true,
        } = options
    
        let getResetValue
        if(extendRef) {
            value = normalizeRef(value, shallow)
            getResetValue = useResetValue(value.value)
        } else {
            getResetValue = useResetValue(value)
            value = normalizeRef(getResetValue(), shallow)
        }

        const model = extendedRef(value, withDescriptor => ({
            reset() {
                model.ref.value = getResetValue()
                model.clear()
            },
            __v_isModel: withDescriptor({
                value: true,
                enumerable: false,
                writable: false
            })
        }), { configurable: false })
        
        if(isModel(validator)) {
            defineReactiveProperties(model, withDescriptor => ({
                errors: withDescriptor({
                    value: validator.errors,
                    unwrap: false
                }),
                validate: validator.validate,
                clear: validator.clear,
                error: withDescriptor({ get: isRef(validator.errors) ? getError : getFalse }),
            }), { configurable: false })
        } else if(isFunction(validator)) {
            let error, checkpoint
            const lastValidation = {
                value: uniqueKey,
                result: undefined,
            }
            defineReactiveProperties(model, withDescriptor => ({
                errors: withDescriptor({
                    value: customRef(track => {
                        const errors = []
                        error = msg => {
                            if(typeof msg === 'string' && msg.length > 0) {
                                errors.push(msg)
                            }
                        }
                        checkpoint = () => {
                            if(errors.length > 0) {
                                throw uniqueKey
                            }
                        }
                        return {
                            get: () => (track(), errors),
                            set: noop
                        }
                    }),
                    unwrap: false
                }),
                validate(force = false) {
                    const modelValue = model.value
                    if(force || !looselyEqual(modelValue, lastValidation.value)) {
                        const errors = model.errors.value
                        errors.length = 0
                        try {
                            console.log('validating...')
                            validator(modelValue, error, checkpoint)
                        } catch(error) {
                            if(error !== uniqueKey) {
                                throw error
                            }
                        }
                        lastValidation.value = shallowCopy(modelValue)
                        lastValidation.result = errors.length === 0
                    }
                    triggerRef(model.errors)
                    return lastValidation.result
                },
                clear: clearError,
                error: withDescriptor({ get: getError }),
            }), { configurable: false })
            /**
             * Required to force trigger of watcher callbacks
             * @See https://github.com/vuejs/core/blob/main/packages/reactivity/src/watch.ts#L245
             */
            model.errors.__v_isShallow = true
        } else {
            defineReactiveProperties(model, withDescriptor => ({
                validate: getTrue,
                clear: noop,
                error: withDescriptor({ get: getFalse }),
            }), { configurable: false })
        }

        if(includeElements) {
            Object.defineProperty(model, 'elements', {
                value: useElements(),
                enumerable: true
            })
        }
        if(includeExposed) {
            Object.defineProperty(model, 'exposed', {
                value: useExposed(),
                enumerable: true
            })
        }
        return model
    }
}