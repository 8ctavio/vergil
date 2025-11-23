import { unref, isRef, toRaw } from "vue"
import { useResetValue } from "#composables"
import { extendedRef } from "#reactivity"

/**
 * @import { MaybeRef } from 'vue'
 * @import { ExtendedRef } from '#reactivity'
 */

/**
 * @template [T = undefined]
 * @template [U = T]
 * @template { boolean } [Shallow = false]
 * @overload
 * @param { MaybeRef<T> } [value]
 * @param { object } [options]
 * @param { Shallow } [options.shallow]	
 * @param { () => T } [options.get]
 * @param { (value: U) => void } [options.set]
 * @param { boolean } [options.cloneResetValue]
 * @returns { ExtendedRef<T, U, { reset: () => void }, Shallow> }
 */

/**
 * Returns extendedRef with reset method.
 * 
 * @param { MaybeRef } value - The extendedRef's initial and reset values. A ref may be used for dynamic reset values.
 * @param { object } [options]
 * @param { boolean } [options.shallow]					- Whether the created extendedRef's underlying ref is shallow. Defaults to `false`.
 * @param { () => unknown } [options.get]				- Custom resetRef's `value` getter function.
 * @param { (value: unknown) => void } [options.set]    - Custom resetRef's `value` setter function.
 * @param { boolean } [options.cloneResetValue]         - Whether to clone the reset value if it is an object. Defaults to `!isRef(value)`.
 * @returns { ExtendedRef }
 * 
 * @example
 *  const str = resetRef('')
 *  str.value = "Vergil"
 *  str.reset()
 *  console.log(str.value) // ''
 * 
 *  const reference = ref(0)
 *  const num = resetRef(reference)
 *  console.log(num.value) // 0
 *  reference.value = 8
 *  num.reset()
 *  console.log(num.value) // 8
 */
export function resetRef(value, options = {}) {
    const { cloneResetValue = !isRef(value) } = options
    const getResetValue = useResetValue(value, cloneResetValue)
    const extended = extendedRef(toRaw(unref(value)), {
        reset() {
            extended.ref.value = getResetValue()
        }
    }, {
        shallow: options.shallow,
        get: options.get,
        set: options.set,
        writable: false,
        configurable: false,
    })
    return extended
}