/**
 * @import { ComponentInternalInstance } from 'vue'
 * @import { InternalExposed, InternalElements } from '#types'
 */

export const symTrigger = Symbol('trigger')
export const symHasInstance = Symbol('hasInstance')

/** @type { WeakMap<any, InternalExposed> } */
export const definedExposed = new WeakMap()
/** @type { WeakMap<any, InternalElements> } */
export const definedElements = new WeakMap()
/** @type { WeakMap<ComponentInternalInstance, { definedExposed: boolean, definedElements: boolean }> } */
export const definedInstances = new WeakMap()