import { isObject } from '#utilities'
import { ModelImpl } from '#composables/.private/ModelImpl'

/**
 * @import { Ref, MaybeRefOrGetter } from 'vue'
 * @import { Model, ModelOptions, UnknownModel } from '#composables'
 * @import { UnwrapRefOrGetter } from '#reactivity'
 * @import { ToCompatible } from '#utilities'
 */

/**
 * Creates a component model.
 * @overload
 * @returns { Model<undefined, false, false, false, false> }
 */

/**
 * Creates a component model.
 * @template { ExtendRef extends true ? Ref : MaybeRefOrGetter } T
 * @template { boolean } [Shallow = false]
 * @template { boolean } [ExtendRef = false]
 * @template { boolean } [IncludeExposed = false]
 * @template { boolean } [IncludeElements = false]
 * @overload
 * @param { T } value Component model's initial value.
 * @param { ModelOptions<UnwrapRefOrGetter<T>, Shallow, ExtendRef, IncludeExposed, IncludeElements> } [options] Model options object.
 * @returns { Model<T, Shallow, ExtendRef, IncludeExposed, IncludeElements> }
 */

/**
 * @param { MaybeRefOrGetter<unknown> } [value]
 * @param { ModelOptions } [options]
 * @returns { Model }
 */
export function useModel(value, options) {
	return isModel(value) ? value : new ModelImpl(value, options)
}

/**
 * Assesses whether a value is a model created by `useModel`.
 * 
 * @template T
 * @param { T } value
 * @param { boolean } [self = false] - When set to `true`, ensures that `value` is a model created by `useModel`, as opposed to an object that extends a model. Defaults to `false`.
 * @returns { value is ToCompatible<T, UnknownModel> }
 */
export function isModel(value, self = false) {
	return isObject(value)
		&& (!self || Object.hasOwn(value, '__isModel'))
		&& /** @type { Record<string, unknown> } */(value).__isModel === true
}