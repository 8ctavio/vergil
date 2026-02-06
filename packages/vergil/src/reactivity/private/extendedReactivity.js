import { isRef, markRaw } from 'vue'
import { isDescriptor } from '#functions'
import { normalizeRef, pull } from '#utilities'

/**
 * @import { Ref, MaybeRef } from 'vue'
 * @import { Entangled, ExtendedRef } from '#reactivity'
 */

let shouldUnwrap = true
let isUnwrappedRef = false

/**
 * Allows to define automatically unwrapped ref properties.
 * @implements { Entangled }
 */
export class EntangledImpl {
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, { value: 'Entangled' })
	}

	constructor() {
		markRaw(this)
	}

	/**
	 * @this { { [key: PropertyKey]: unknown } }
	 * @param { PropertyKey } key - An auto-unwrapped ref property key.
	 * @returns { Ref<unknown> | undefined }
	 */
	getRef(key) {
		shouldUnwrap = false
		isUnwrappedRef = false
		try {
			const v = this[key]
			return isUnwrappedRef ? /** @type { Ref } */(v) : undefined
		} finally {
			shouldUnwrap = true
		}
	}

	/**
	 * @param { Record<PropertyKey, unknown> } extension	- Object whose own key-value pairs represent key-descriptor pairs used to define corresponding properties on the underlying entangled object.
	 * @param { object } [options]							- Additional options.
	 * @param { boolean } [options.defaults]				- Default value of the `configurable`, `enumerable`, and `writable` options. Defaults to `true`.
	 * @param { boolean } [options.configurable]			- Default `configurable` property value for descriptors of newly created properties. Defaults to `defaults`.
	 * @param { boolean } [options.enumerable]				- Default `enumerable` property value for descriptors of newly created properties. Defaults to `defaults`.
	 * @param { boolean } [options.writable]				- Default `writable` property value for descriptors of newly created properties. Defaults to `defaults`.
	 * @param { PropertyKey[] } [options.ignore]			- Array of `extension` property keys not to be defined on the underlying entangled object.
	 */
	extend(extension, options = {}) {
		const {
			defaults = true,
			configurable = defaults,
			enumerable = defaults,
			writable = defaults,
			ignore = [],
		} = options

		ignore.push('__v_skip')
		if (this instanceof ExtendedRefImpl) ignore.push('ref', 'value')

		for (const getKeys of [Object.getOwnPropertyNames, Object.getOwnPropertySymbols]) {
			for (const key of getKeys(extension)) {
				const idx = ignore.indexOf(key)
				if (idx > -1) {
					pull(ignore, idx)
					continue
				}

				/**
				 * @typedef { {
				 *     value?: unknown;
				 *     writable?: boolean;
				 *     enumerable?: boolean;
				 *     configurable?: boolean;
				 *     get?: () => unknown;
				 *     set?: (v: unknown) => void;
				 *     unwrap?: boolean;
				 * } } EntangledDescriptor
				 */
				const v = extension[key]
				const descriptor = /** @type { EntangledDescriptor } */ (isDescriptor(v) ? v : { value: v })

				const initDescriptor = !Object.hasOwn(this, key)
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
						Object.defineProperty(this, key, {
							get: customGet === undefined
								? () => {
									if (shouldUnwrap) {
										return _ref.value
									} else {
										isUnwrappedRef = true
										return _ref
									}
								}
								: () => {
									if (shouldUnwrap) {
										return customGet(true)
									} else {
										isUnwrappedRef = true
										const _ref = customGet(false)
										return isRef(_ref) ? _ref : undefined
									}
								},
							set: descriptor.set ?? ((v) => { _ref.value = v }),
							enumerable: descriptor.enumerable,
							configurable: descriptor.configurable
						})
					} else {
						Object.defineProperty(this, key, descriptor)
					}
				} else {
					Object.defineProperty(this, key, descriptor)
				}
			}
		}
		return this
	}
}

/**
 * Stores a ref object and defines `value` accessor methods to read from and write to that ref's value.
 * @implements { ExtendedRef }
 */
export class ExtendedRefImpl extends EntangledImpl {
	ref = /** @type { Ref } */ (/** @type { unknown } */ (undefined))

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, { value: 'ExtendedRef' })
	}

	/**
	 * @param { unknown } value 
	 * @param { object } [options]
	 * @param { boolean } [options.shallow = false]
	 * @param { () => unknown } [options.get]
	 * @param { (v: unknown) => void } [options.set]
	 */
	constructor(value, { shallow = false, get, set } = {}) {
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
	[Symbol.toPrimitive]() {
		return this.ref.value
	}
}