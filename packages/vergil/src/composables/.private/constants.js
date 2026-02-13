/**
 * @import { ComponentInternalInstance } from 'vue'
 * @import { InternalExposed, InternalElements } from './exposed.types'
 */

export const _deep_ = Symbol('watchers:deep')
export const _trigger_ = Symbol('elements:trigger')
export const _hasComponent_ = Symbol('elements:hasComponent')

/** @type { WeakMap<object, InternalExposed> } */
export const definedExposed = new WeakMap()
/** @type { WeakMap<object, InternalElements> } */
export const definedElements = new WeakMap()

/** @type { WeakMap<ComponentInternalInstance, { definedExposed: boolean, definedElements: boolean }> } */
export const componentInstanceMap = new WeakMap()