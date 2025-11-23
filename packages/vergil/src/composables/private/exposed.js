/**
 * @import { ComponentInternalInstance } from 'vue'
 * @import { InternalExposed, InternalElements } from '#composables'
 */

export const _trigger_ = Symbol('trigger')
export const _hasComponent_ = Symbol('hasComponent')

/** @type { WeakMap<object, InternalExposed> } */
export const definedExposed = new WeakMap()
/** @type { WeakMap<object, InternalElements> } */
export const definedElements = new WeakMap()

/** @type { WeakMap<ComponentInternalInstance, { definedExposed: boolean, definedElements: boolean }> } */
export const componentInstanceMap = new WeakMap()