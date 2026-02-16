import { isRef, markRaw } from 'vue'
import { isDescriptor, normalizeRef, pull } from '#utilities'

/**
 * @import { Ref, MaybeRef, MaybeRefOrGetter } from 'vue'
 * @import {
 *   Entangled,
 *   EntangledDescriptor,
 *   EntangledOptions,
 *   WithEntangled,
 *   EntangledUnwrappedPropertyKeys,
 *   EntangledUnwrappedPropertyRefs,
 *   ExtendedRef,
 *   UnwrapRefOrGetter,
 *   NormalizeRef
 * } from '#reactivity'
 */

let unwrap = true

export class EntangledImpl {
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, { value: 'Entangled' })
	}

	constructor() {
		markRaw(this)
	}

	/**
	 * Retrieves underlying ref object of auto-unwrapped ref property.
	 * 
	 * @template { Record<PropertyKey, unknown> } P
	 * @template { PropertyKey } I
	 * @template { EntangledUnwrappedPropertyKeys<P,I> } K
	 * @overload
	 * @this { ExtendedRef<any, any, any, P, I> }
	 * @param { K } key Property key of auto-unwrapped ref
	 * @returns { EntangledUnwrappedPropertyRefs<P, K> }
	 */
	/**
	 * Retrieves underlying ref object of auto-unwrapped ref property.
	 * 
	 * @template { Record<PropertyKey, unknown> } P
	 * @template { PropertyKey } I
	 * @template { EntangledUnwrappedPropertyKeys<P,I> } K
	 * @overload
	 * @this { Entangled<P, I> }
	 * @param { K } key Property key of auto-unwrapped ref
	 * @returns { EntangledUnwrappedPropertyRefs<P, K> }
	 */
	/**
	 * @this { { [key: PropertyKey]: any } }
	 * @param { PropertyKey } key
	 * @returns { Ref<unknown> | undefined }
	 */
	$ref(key) {
		unwrap = false
		try {
			const v = this[key]
			return unwrap ? /** @type { Ref } */(v) : undefined
		} finally {
			unwrap = true
		}
	}
}

/**
 * Defines properties with automatic ref unwrapping by default.
 * 
 * @template { object } O
 * @template { Record<PropertyKey, unknown> } P
 * @template { PropertyKey } [Ignore = never]
 * @overload
 * @param { O } object
 * @param { P } properties
 *   Object whose own key-value pairs represent key-descriptor pairs used to define
 *   corresponding properties on the underlying entangled object.
 * @param { EntangledOptions<Ignore> } [options]
 * @returns { WithEntangled<O, P, Ignore> }
 */
/**
 * @param { object } object
 * @param { Record<PropertyKey, unknown> } properties
 * @param { EntangledOptions } [options]
 */
export function defineEntangledProperties(object, properties, options = {}) {
	const {
		defaults = true,
		configurable = defaults,
		enumerable = defaults,
		writable = defaults,
		ignore = [],
	} = options

	ignore.push('__v_skip')
	if (object instanceof ExtendedRefImpl) ignore.push('ref', 'value')

	for (const getKeys of [Object.getOwnPropertyNames, Object.getOwnPropertySymbols]) {
		for (const key of getKeys(properties)) {
			const idx = ignore.indexOf(key)
			if (idx > -1) {
				pull(ignore, idx)
				continue
			}

			const v = properties[key]
			const descriptor = /** @type { EntangledDescriptor } */ (isDescriptor(v) ? v : { value: v })

			const initDescriptor = !Object.hasOwn(object, key)
			if (initDescriptor) {
				if (configurable) descriptor.configurable ??= true
				if (enumerable) descriptor.enumerable ??= true
			}

			if (
				Object.hasOwn(descriptor, 'value')
				|| !(Object.hasOwn(descriptor, 'get') || Object.hasOwn(descriptor, 'set'))
			) {
				if (initDescriptor && writable) {
					descriptor.writable ??= true
				}
				if (isRef(descriptor.value) && descriptor.unwrap != false) {
					const _ref = descriptor.value
					const customGet = /** @type { (shouldUnwrap: boolean) => MaybeRef } */ (descriptor.get)
					Object.defineProperty(object, key, {
						get: customGet === undefined
							? () => {
								if (unwrap) {
									return _ref.value
								} else {
									unwrap = true
									return _ref
								}
							}
							: () => {
								if (unwrap) {
									return customGet(true)
								} else {
									unwrap = true
									const _ref = customGet(false)
									return isRef(_ref) ? _ref : undefined
								}
							},
						set: descriptor.set ?? ((v) => { _ref.value = v }),
						enumerable: descriptor.enumerable,
						configurable: descriptor.configurable
					})
				} else {
					Object.defineProperty(object, key, descriptor)
				}
			} else {
				Object.defineProperty(object, key, descriptor)
			}
		}
	}

	return object
}

/**
 * @template { MaybeRefOrGetter } [T = unknown]
 * @template [U = UnwrapRefOrGetter<T>]
 * @template { boolean } [Shallow = false]
 * @typedef { object } ExtendedRefImplOptions
 * @property { Shallow } [shallow]
 * @property { () => UnwrapRefOrGetter<T> } [get]
 * @property { (value: U) => void } [set]
 */

/**
 * Stores a ref object and defines `value` accessor methods to read from and write to that ref's value.
 * 
 * @template { MaybeRefOrGetter } [T = unknown]
 * @template [U = UnwrapRefOrGetter<T>]
 * @template { boolean } [Shallow = false]
 */
export class ExtendedRefImpl extends EntangledImpl {
	/** @type { NormalizeRef<T, Shallow> } */
	ref = /** @type { any } */ (undefined)

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, { value: 'ExtendedRef' })
	}

	/**
	 * @param { T } value
	 * @param { ExtendedRefImplOptions<T, U, Shallow> } [options]
	 */
	constructor(value, { shallow, get, set } = {}) {
		super()
		Object.defineProperty(this, 'ref', {
			value: normalizeRef(value, shallow),
			writable: false,
			enumerable: false,
			configurable: false
		})
		if (get || set) {
			Object.defineProperty(this, 'value', {
				get: get ?? (() => this.ref.value),
				// @ts-expect-error
				set: set ?? (v => this.ref.value = v)
			})
		}
	}

	/** @returns { UnwrapRefOrGetter<T> } */
	get value() {
		return this.ref.value
	}

	/** @param { U } v */
	set value(v) {
		// @ts-expect-error
		this.ref.value = v
	}

	/** @returns { UnwrapRefOrGetter<T> } */
	[Symbol.toPrimitive]() {
		return this.ref.value
	}
}