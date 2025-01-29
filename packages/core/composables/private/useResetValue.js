import { isRef, toValue, toRaw } from 'vue'
import { isObject } from '../../utilities'

export function useResetValue(reference) {
    reference = isRef(reference) || !isObject(reference)
        ? reference
        : structuredClone(toRaw(reference))
    return () => {
        const value = toValue(reference)
        return isObject(value)
            ? structuredClone(toRaw(value))
            : value
    }
}