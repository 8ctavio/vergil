import { isPlainObject } from "./public"
import { isDate } from "./calendar"

export const uniqueKey = Object.preventExtensions({})
export const noop = () => {}
/** @type { () => true } */
export const getTrue = () => true
/** @type { () => false } */
export const getFalse = () => false

/**
 * @param { number } n
 * @param { number } min
 * @param { number } max
 */
export function clamp(n, min, max) {
	return Math.min(Math.max(min, n), max)
}

/**
 * @param { unknown } n 
 * @returns { number }
 */
export function toInteger(n) {
	n = Math.trunc(Number(n))
	return Number.isNaN(n) || Object.is(n, -0) ? 0 : /** @type {number} */ (n)
}

/**
 * @param { unknown[] } arr
 * @param { number } idx
 * @returns { void }
 */
export function pull(arr, idx) {
	if (Number.isInteger(idx)) {
		if (idx >= 0 && idx < arr.length) {
			arr[idx] = arr[arr.length - 1]
			arr.pop()
		} else {
			throw new RangeError(`Array index ${idx} is outside array bounds [0,${Math.max(0, arr.length - 1)}]`)
		}
	} else {
		throw new TypeError(`Array index must be an integer; received ${typeof idx === 'number' ? idx : Object.prototype.toString.call(idx)}`)
	}
}

/**
 * @template T
 * @param { T } value
 * @returns { T }
 */
export function shallowCopy(value) {
	if (Array.isArray(value)) {
		return /** @type { T } */ ([...value])
	} else if (isDate(value)) {
		return /** @type { T } */ (new Date(value))
	} else if (isPlainObject(value)) {
		return { ...value }
	} else {
		return value
	}
}

/**
 * @template T
 * @param { T } a
 * @param { unknown } b
 * @returns { b is T }
 */
export function looselyEqual(a, b) {
	if (a === b) {
		return true
	} else if (Array.isArray(a)) {
		if (Array.isArray(b)) {
			if (a.length !== b.length) return false
			let equal = true
			for (let i = 0; equal && i < a.length; i++) {
				equal = looselyEqual(a[i], b[i])
			}
			return equal
		} else {
			return false
		}
	} else if (isDate(a)) {
		return isDate(b) && a.getTime() === b.getTime()
	} else if (isPlainObject(a) && isPlainObject(b)) {
		const keys = Object.keys(a)
		if (keys.length !== Object.keys(b).length) return false
		for (const key of keys) {
			if (!(Object.hasOwn(b, key) && looselyEqual(
				/** @type { Record<string, unknown> } */(a)[key],
				/** @type { Record<string, unknown> } */(b)[key]
			))) {
				return false
			}
		}
		return true
	} else {
		return false
	}
}