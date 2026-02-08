import { isObject } from "#utilities/common"

/**
 * Verifies object keys satisfy required and optional keys specification.
 * 
 * @param { object } obj - Object to perform key verification on.
 * @param { string[] | {
 *     required?: string[];
 *     optional?: string[]; 
 * } } keys - Expected `required` and `optional` keys to be present in the object. Optional keys verification is only performed for `strict = true`. As an array, `keys` represents the required keys only.
 * @param { boolean } [strict = true] - Whether non-required keys are allowed. If optional keys are specified, object's non-required keys must be `optional` keys. Defaults to `true`.
 * @returns { boolean }
 */
export function everyKeyInObject(obj, keys, strict = true) {
	if (!isObject(obj) || !isObject(keys)) return false
	const { required = [], optional = [] } = Array.isArray(keys) ? { required: keys } : keys
	if (!Array.isArray(required) || !Array.isArray(optional)) return false

	const providedKeys = Object.keys(obj)
	const requiredKeys = new Set(required)
	if (providedKeys.length < requiredKeys.size) return false
	if (optional.length && strict) {
		const optionalKeys = new Set(optional).difference(requiredKeys)
		if (providedKeys.length > requiredKeys.size + optionalKeys.size) return false
		let requiredCount = 0
		return providedKeys.every(key => requiredKeys.has(key) ? ++requiredCount : optionalKeys.has(key))
			&& requiredCount === requiredKeys.size
	} else {
		return strict && providedKeys.length !== requiredKeys.size
			? false
			: requiredKeys.isSubsetOf(new Set(providedKeys))
	}
}