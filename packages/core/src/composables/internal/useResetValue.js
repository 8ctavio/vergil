import { isRef, toRaw } from 'vue'
import { isObject } from '#utilities'

/**
 * @import { Ref, MaybeRef } from 'vue'
 */

/**
 * @template T
 * @param { MaybeRef<T> } reference
 * @param { boolean } [cloneReference]
 * @returns { () => T }
 */
export function useResetValue(reference, cloneReference = !isRef(reference)) {
    const isReactiveReference = isRef(reference)
    
    if (cloneReference) {
        // @ts-expect-error
        const raw = /**@type {T}*/(toRaw(isReactiveReference ? reference._value : reference))
        if (isObject(raw)) {
            reference = structuredClone(raw)
            return () => structuredClone(/**@type {T}*/(reference))
        }
    }

    if (isReactiveReference) {
        return () => toRaw(/**@type {Ref}*/(reference).value)
    } else {
        reference = toRaw(reference)
        return () => /**@type {T}*/(reference)
    }
}