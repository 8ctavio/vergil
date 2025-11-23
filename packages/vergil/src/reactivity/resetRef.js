import { isRef } from "vue"
import { useResetValue } from "#composables"
import { extendedRef } from "#reactivity"

/**
 * @import { MaybeRef } from 'vue'
 * @import { ExtendedRef } from '#reactivity'
 */

/**
 * @template T
 * @overload
 * @param { MaybeRef<T> } reference
 * @param { boolean } [cloneReference]
 * @returns { ExtendedRef<T, T, { reset: () => void }> }
 */

/**
 * Returns extendedRef with reset method.
 * 
 * @param { MaybeRef } reference - The extendedRef's initial and reset values. A ref may be used for dynamic reset values.
 * @param { boolean } [cloneReference] - Whether to clone the reference if it is an object. Defaults to `!isRef(reference)`.
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
export function resetRef(reference, cloneReference = !isRef(reference)) {
    const getResetValue = useResetValue(reference, cloneReference)
    const extended = extendedRef(getResetValue(), {
        reset() {
            extended.value = getResetValue()
        }
    }, { configurable: false, writable: false })
    return extended
}