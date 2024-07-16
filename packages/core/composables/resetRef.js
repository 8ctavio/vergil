import { isRef, toValue, toRaw } from 'vue'

/**
 * Returns extended ref with reset method.
 * 
 * @template T
 * @param { T | Ref<T> | () => T } initial - The extend ref's default value. A ref or getter can be used for a dynamic default value.
 * 
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
export function resetRef(initial){
    const reference = (
        isRef(initial)
        || (typeof initial !== 'object')
        || initial === null
    ) ? initial : structuredClone(toRaw(initial))
    function getReferenceCopy(){
        const value = toValue(reference)
        return ((typeof value !== 'object') || value === null) ? value : structuredClone(toRaw(value))
    }
    return extendedRef(getReferenceCopy(), {
        reset(){
            this.value = getReferenceCopy()
        }
    })
}