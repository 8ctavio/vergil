import { markRaw, toRef } from 'vue'

/** Stores `refs` index of automatically unwrapped reactive properties. */
export class ExtendedReactive {
	constructor() {
		markRaw(this)
		Object.defineProperty(this, 'refs', { value: {} })
	}
}

/** Stores a ref object and defines `value` accessor methods to read from and write to that ref's value. */
export class ExtendedRef extends ExtendedReactive {
	constructor(value, { get, set } = {}) {
		super()
		Object.defineProperty(this, 'ref', {
			value: toRef(value)
		})
		if(get || set) {
			Object.defineProperty(this, 'value', {
				get: get ?? (() => this.ref.value),
				set: set ?? (v => this.ref.value = v)
			})
		}
	}
	get value() {
		return this.ref.value
	}
	set value(v) {
		this.ref.value = v
	}
}

/**
 * Assesses whether a value is an `ExtendedReactive`.
 * 
 * @param { any } value
 * @returns { boolean } `true` if `value` is an `ExtendedReactive`.
 */
export function isExtendedReactive(value){
    return value instanceof ExtendedReactive
}

/**
 * Assesses whether a value is an `ExtendedRef`.
 * 
 * @param { any } value
 * @returns { boolean } `true` if `value` is an `ExtendedRef`.
 */
export function isExtendedRef(value){
    return value instanceof ExtendedRef
}