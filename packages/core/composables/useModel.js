import { isShallow, triggerRef, customRef, getCurrentInstance, onScopeDispose } from 'vue'
import { useElements, useExposed, defineReactiveProperties } from '.'
import { isExtendedRef } from './extendedReactivity'
import { extendedRef } from './extendedReactivity/extendedRef'
import { privateModelMap, useResetValue } from './private'
import { debounce, isFunction } from '../utilities'
import { normalizeRef, shallowCopy, looselyEqual, noop, getTrue, getFalse, uniqueKey } from '../utilities/private'

const getNoop = () => noop
function getError() {
    return this.errors.value.length > 0
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
 *      validator: (
 *          value: T,
 *          error: (msg: string) => void,
 *          checkpoint: () => void
 *      ) => void;
 *      includeElements: boolean;
 *      includeExposed: boolean;
 * } } options -
 *  - `shallow`: Whether to use `shallowRef` for the model's internal `ref` object. Defaults to `false`.
 *  - `extendRef`: If `value` is a ref, whether to use the provided ref itself as the extendedRef's underlying `ref` object. When set to `false`, the `value` ref is instead used as the dynamic source of reset values. When set to `true`, the reset value will be the `value` ref's initial value. Defaults to `false`.
 *  - `validator`: Function to peform model-value validation and collect encountered validation errors.
 *  - `includeExposed`/`includeElements`: Whether to include the `exposed`/`elements` object into the model. Defaults to `true`.
 * 
 * @returns { ExtendedRef }
 */
export function useModel(value, options = {}) {
    if(isModel(value)) {
        return value
    } else {
        const {
            shallow = false,
            extendRef = false,
            validator,
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
        
        let useDebouncedValidate = getNoop
        if(isFunction(validator)) {
            let error, checkpoint
            const cancelHandlers = []
            const lastValidation = {
                value: uniqueKey,
                result: undefined,
            }
            defineReactiveProperties(model, withDescriptor => ({
                error: withDescriptor({ get: getError }),
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
                            validator(modelValue, error, checkpoint)
                        } catch(error) {
                            if(error !== uniqueKey) {
                                throw error
                            }
                        }
                        lastValidation.value = shallowCopy(modelValue)
                        lastValidation.result = errors.length === 0
                    }
                    for(const cancel of cancelHandlers) {
                        cancel()
                    }
                    triggerRef(model.errors)
                    return lastValidation.result
                },
                clear() {
                    model.errors.value.length = 0
                    for(const cancel of cancelHandlers) {
                        cancel()
                    }
                    triggerRef(model.errors)
                },
            }), { configurable: false })
            /**
             * Required to force trigger of watcher callbacks
             * @See https://github.com/vuejs/core/blob/main/packages/reactivity/src/watch.ts#L245
             */
            model.errors.__v_isShallow = true

            useDebouncedValidate = (delay, options) => {
                if(getCurrentInstance()) {
                    const debounced = debounce(model.validate, delay, options)
                    cancelHandlers.push(debounced.cancel)
                    onScopeDispose(() => {
                        const idx = cancelHandlers.indexOf(debounced.cancel)
                        cancelHandlers.splice(idx,1)
                    })
                    return debounced
                }
            } 
        } else {
            defineReactiveProperties(model, withDescriptor => ({
                error: withDescriptor({ get: getFalse }),
                validate: getTrue,
                clear: noop,
            }), { configurable: false })
        }

        privateModelMap.set(model, {
            hasInteractiveCtx: false,
            resetInteractiveCtx: false,
            triggerIfShallow() {
                if(isShallow(model.ref)) {
                    triggerRef(model.ref)
                }
            },
            useDebouncedValidate
        })

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