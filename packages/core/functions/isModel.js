import { isObject } from "../utilities"

/**
 * Assesses whether a value is a model created by `useModel`.
 * 
 * @param { any } value
 * @param { boolean } self - When set to `true`, ensures that `value` is a model created by `useModel`, as opposed to an object that extends a model. Defaults to `false`.
 * 
 * @returns { boolean } `true` if `value` is a model created by `useModel`.
 */
export function isModel(value, self = false) {
	return isObject(value)
		&& (!self || Object.hasOwn(value, '__v_isModel'))
		&& value.__v_isModel === true
}