import { defineReactiveProperties } from './defineReactiveProperties'
import { ExtendedRef } from '../utilities'

/**
 * Extends a ref with additional properties.
 * 
 * @template T,E
 * @param { T | (() => T) | Ref<T> | ExtendedRef<T,F> } initial - Value to normalize into the ref to be extended. If an extendedRef is provided, it is extended without creating a new `ExtendedRef` object.
 * @param { E | (withDescriptor: function) => E } [extension] - Extension object or callback that returns extension object. The extension object keys represent the names of the properties to be defined while its values represent the properties' initial values or descriptors.
 * 
 * @returns { ExtendedRef }
 * 
 * @example
 *	const extendedA = extendedRef(0, { extra: '' })
 *	// read and write inner reactive value normally
 *	extendedA.value = 8
 *	console.log(extendedA.value)
 *	// read and write extended properties
 *	extendedA.extra = 'some value'
 *	console.log(extendedA.extra)
 *	
 *	// Configure extended properties
 *	const extendedB = extendedRef(0, (withDescriptor) => ({
 *		extra1: 1,
 *		extra2: withDescriptor({ value: 2, enumerable: false, writable: false }),
 *		extra3: withDescriptor({ value: ref(3), enumerable: true, readonly: true })
 *	}))
 */
export function extendedRef(initial, extension) {
	return defineReactiveProperties(
		initial instanceof ExtendedRef ? initial : new ExtendedRef(initial),
		extension
	)
}

/**
 * Extends a ref with additional properties and custom accessor.
 * 
 * @template T,E
 * @param { T | (() => T) | Ref<T> } initial - Value to normalize into the ref to be extended.
 * @param { { get?: () => T, set?: () => void } } accessor - Custom `value` property accessor.
 * @param { E | (withOptions: function) => E } [extension] - Extension object or callback that returns extension object. The extension object keys represent the names of the properties to be defined while its values represent the properties' initial values or descriptors.
 * 
 * @returns { ExtendedRef }
 * 
 * @example
 *	let n
 *	const extended = extendedRef(0, {
 *		get(){
 *			console.log('inner value retrieved')
 *			return this.ref.value
 *		},
 *		set(v){
 *			this.ref.value = v
 *			console.log('inner value updated')
 *		}
 *	}, withDescriptor => ({
 *		extra: ''
 *	}))
 *	extended.value = 8 // 'inner value updated'
 *	n = extended.value // 'inner value retrieved'
 */
export function extendedCustomRef(initial, accessor, extension) {
	return defineReactiveProperties(
		new ExtendedRef(initial, accessor),
		extension
	)
}