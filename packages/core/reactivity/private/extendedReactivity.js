import { isRef, toRef, markRaw } from 'vue'
import { isDescriptor } from '../../functions'
import { pull } from '../../utilities'

let shouldUnwrap = true
let isUnwrappedRef = false

/** Allows to define unwrapped ref properties. */
export class Entangled {
	constructor() {
		markRaw(this)
	}

	getRef(key) {
		shouldUnwrap = false
		isUnwrappedRef = false
		try {
			const v = this[key]
			return isUnwrappedRef ? v : undefined
		} finally {
			shouldUnwrap = true
		}
	}
	extend(extension, options = {}) {
		const {
			defaults = true,
			configurable = defaults,
			enumerable = defaults,
			writable = defaults,
			ignore = [],
		} = options

		ignore.push('__v_skip')
		if (this instanceof ExtendedRef) ignore.push('ref', 'value')

		for (const getKeys of [Object.getOwnPropertyNames, Object.getOwnPropertySymbols]) {
			for (const key of getKeys(extension)) {
				const idx = ignore.indexOf(key)
				if (idx > -1) {
					pull(ignore, idx)
					continue
				}

				const v = extension[key]
				const descriptor = isDescriptor(v) ? v : { value: v }

				const initDescriptor = !Object.hasOwn(this, key)
				if (initDescriptor) {
					if (configurable) descriptor.configurable ??= true
					if (enumerable) descriptor.enumerable ??= true
				}

				if (Object.hasOwn(descriptor, 'value')) {
					if (initDescriptor && writable) {
						descriptor.writable ??= true
					}
					if (isRef(descriptor.value) && descriptor.unwrap != false) {
						const _ref = descriptor.value
						const customGet = descriptor.get
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
Object.defineProperty(Entangled.prototype, Symbol.toStringTag, { value: 'Entangled' })

/** Stores a ref object and defines `value` accessor methods to read from and write to that ref's value. */
export class ExtendedRef extends Entangled {
	constructor(value, { get, set } = {}) {
		super()
		Object.defineProperty(this, 'ref', {
			value: toRef(value)
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
}
Object.defineProperty(ExtendedRef.prototype, Symbol.toStringTag, { value: 'ExtendedRef' })