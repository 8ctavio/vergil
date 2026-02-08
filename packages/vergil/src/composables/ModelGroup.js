import { ModelGroupImpl } from "#composables"

/**
 * @import { ModelGroupConstructor, ModelGroupInstance, ModelGroupFields } from "#composables"
 */

/**
 * @template { ModelGroupFields } [F = ModelGroupFields]
 * @typedef { ModelGroupInstance<F> } ModelGroup
 */

/** @type { ModelGroupConstructor } */
export const ModelGroup = /** @type {any} */(ModelGroupImpl)

/**
 * Assesses whether a value is a model created by `useModelGroup`.
 * 
 * @param { unknown } value
 * @returns { value is ModelGroup<ModelGroupFields> }
 */
export function isModelGroup(value) {
	return value instanceof ModelGroupImpl
}