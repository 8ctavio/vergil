import { toRef, isRef, markRaw } from 'vue'
import { symSetRef } from './private'

/** Defines accessor methods to read and write internally stored refs of automatically unwrapped reactive properties. */
export class ExtendedReactive {
	#refs = {}
	constructor() {
		markRaw(this)
		Object.defineProperties(this, {
			getRef: {
				value: (property) => this.#refs[property],
			},
			[symSetRef]: {
				value: (property, refProperty) => {
                    if(isRef(refProperty)) this.#refs[property] = refProperty
				},
			},
		})
	}
}

/** Defines a `ref` property to store a ref object and `value` accessor methods to read from and write to that ref's value. */
export class ExtendedRef extends ExtendedReactive {
	constructor(initial, accessor = {}) {
		super()
		const {
			get = function () {
				return this.ref.value
			},
			set = function (v) {
				this.ref.value = v
			},
		} = accessor
		Object.defineProperties(this, {
			ref: { value: toRef(initial) },
			value: { get, set },
		})
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