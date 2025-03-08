import { isPlainObject } from ".."
import { isDate } from "./calendar"

export const uniqueKey = Object.preventExtensions({})
export const noop = () => {}
export const getTrue = () => true
export const getFalse = () => false

export function shallowCopy(value) {
	if(Array.isArray(value)) {
		return [...value]
	} else if(isDate(value)) {
		return new Date(value)
	} else if(isPlainObject(value)) {
		return { ...value }
	} else {
		return value
	}
}

export function looselyEqual(a, b) {
	if(a === b) {
		return true
	} else if(Array.isArray(a)) {
		if(Array.isArray(b)) {
			if(a.length !== b.length) return false
			let equal = true
			for(let i=0; equal && i<a.length; i++) {
				equal = looselyEqual(a[i], b[i])
			}
			return equal
		} else {
			return false
		}
	} else if(isDate(a)) {
		return isDate(b) && a.getTime() === b.getTime()
	} else if(isPlainObject(a) && isPlainObject(b)) {
		const keys = Object.keys(a)
		if(keys.length !== Object.keys(b).length) return false
		for(const key of keys) {
			if(!(Object.hasOwn(b, key) && looselyEqual(a[key], b[key]))) {
				return false
			}
		}
		return true
	} else {
		return false
	}
}