import { isRef, toValue, toRaw } from 'vue'

export function useResetValue(reference) {
    reference = (
        isRef(reference)
        || (typeof reference !== 'object')
        || reference === null
    ) ? reference : structuredClone(toRaw(reference))
    return () => {
        const value = toValue(reference)
        return ((typeof value !== 'object') || value === null) ? value : structuredClone(toRaw(value))
    }
}