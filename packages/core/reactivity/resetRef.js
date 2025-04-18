import { extendedRef } from "."
import { useResetValue } from "../composables/private"

/**
 * @import { MaybeRefOrGetter } from 'vue'
 * @import { ExtendedRef } from '../types'
 */

/**
 * @template T
 * @overload
 * @param { MaybeRefOrGetter<T> } reference
 * @returns { ExtendedRef<T, T, { reset: () => void }> }
 */

/**
 * Returns extended ref with reset method.
 * 
 * @param { MaybeRefOrGetter } reference - The extended ref's initial and reset values. A ref or getter can be used for a dynamic reset value.
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
export function resetRef(reference) {
    const getResetValue = useResetValue(reference)
    const extended = extendedRef(getResetValue(), {
        reset() {
            extended.value = getResetValue()
        }
    }, { configurable: false, writable: false })
    return extended
}