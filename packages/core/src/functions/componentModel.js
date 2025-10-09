import { ModelGroupImpl } from "#composables"
import { isObject } from "#utilities"

/** @import { Model, ModelGroup } from '#composables' */

/**
 * Assesses whether a value is a model created by `useModel`.
 * 
 * @param { unknown } value
 * @param { boolean } [self = false] - When set to `true`, ensures that `value` is a model created by `useModel`, as opposed to an object that extends a model. Defaults to `false`.
 * @returns { value is Model }
 */
export function isModel(value, self = false) {
	return isObject(value)
		&& (!self || Object.hasOwn(value, '__v_isModel'))
		&& /** @type { Record<string, unknown> } */(value).__v_isModel === true
}

/**
 * Assesses whether a value is a model created by `useModelGroup`.
 * 
 * @param { unknown } value
 * @returns { value is ModelGroup }
 */
export function isModelGroup(value) {
	return value instanceof ModelGroupImpl
}