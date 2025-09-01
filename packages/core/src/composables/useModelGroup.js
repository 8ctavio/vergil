import { ModelGroupImpl } from "#composables"

/**
 * @import { ModelGroup, ModelGroupFields, ModelGroupFieldsConstraint, ModelGroupValidator, ModelGroupSpec } from '#types'
 */

/**
 * @template { ModelGroupFields } [F = {}]
 * @overload
 * @param { F & ModelGroupFieldsConstraint<F> } fields
 * @returns { ModelGroup<F, false> }
 */

/**
 * @template { ModelGroupFields } [F = {}]
 * @overload
 * @param { F & ModelGroupFieldsConstraint<F> } fields
 * @param { ModelGroupValidator<F> } validator
 * @returns { ModelGroup<F, true> }
 */

/**
 * @param { ModelGroupFields } fields
 * @param { ModelGroupValidator } [validator]
 */
export function useModelGroup(fields, validator) {
	return new ModelGroupImpl(fields, validator)
}

/**
 * @template { ModelGroupFields } [F = {}]
 * @param { F & ModelGroupFieldsConstraint<F> } fields
 * @param { ModelGroupValidator<F> } [validator]
 * @returns { ModelGroupSpec<F> }
 */
// @ts-expect-error
useModelGroup.nested = function(fields, validator) {
	return /** @type { ModelGroupSpec<F> } */ (
		Object.defineProperties(fields, {
			__modelGroup: { value: true },
			__validator: { value: validator }
		})
	)
}
Object.defineProperty(useModelGroup, 'nested', {
	configurable: false,
	writable: false
})