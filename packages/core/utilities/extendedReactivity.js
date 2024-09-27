import { toRef, markRaw } from 'vue'
import { symSetRef } from './private'

/** Defines accessor methods to read and write internally stored refs of automatically unwrapped reactive properties. */
export class ExtendedReactive {
	#refs = {}
	constructor() {
		markRaw(this)
	}
	getRef(property) {
		return this.#refs[property]
	}
	[symSetRef](property, refProperty) {
		this.#refs[property] = toRef(refProperty)
	}
}

/** Stores a ref object and defines `value` accessor methods to read from and write to that ref's value. */
export class ExtendedRef extends ExtendedReactive {
	#ref
	constructor(value) {
		super()
		this.#ref = toRef(value)
	}
	get ref() {
		return this.#ref
	}
	get value() {
		return this.#ref.value
	}
	set value(v) {
		this.#ref.value = v
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

/**
 * Assesses whether a value is a model created by `useModel`.
 * 
 * @param { any } value
 * @returns { boolean } `true` if `value` is a model created by `useModel`.
 */
export function isModel(value){
    return isExtendedRef(value) && Boolean(value?.__v_isModel)
}

/**
 * Assesses whether a value is a model wrapped by `useModel`.
 * 
 * @param { any } value
 * @returns { boolean } `true` if `value` is a model wrapped by `useModel`.
 */
export function isModelWrapper(value){
    return isExtendedRef(value) && Boolean(value?.__v_isModelWrapper)
}