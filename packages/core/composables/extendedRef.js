import { toRef, isRef, readonly, markRaw } from 'vue'

/** Object property's configuration options */
class Options{
    constructor(options){
        for(const option in options){
            this[option] = options[option]
        }
    }
}

/** Extendable object with accessors (getter and setter) for an internal ref's value */
class ExtendedRef {
    #ref
    #refs = {}

    get value(){ return this.#ref.value }
    set value(v){ this.#ref.value = v }
    get ref(){ return this.#ref }
    /**
     * Returns the ref object of an extended property or the extended ref if no property is specified
     * @param { string } [property] - Name of extended property
     * @returns { Ref | undefined }
     */
    getRef(property){
        return property ? this.#refs[property] : this.#ref
    }

    constructor(initial, extension = {}){
        if(typeof extension === 'function')
            extension = extension((value, options) => new Options({ ...options, value }))
        if(typeof extension !== 'object' || extension === null)
            throw new TypeError("Invalid value for 'extension' parameter")

        if(initial instanceof ExtendedRef) {
            // Extend ExtendedRef
            this.#ref = initial.ref
            for(const property of Object.getOwnPropertyNames(initial)){
                if(['__v_skip'].includes(property)) continue

                const descriptor = Object.getOwnPropertyDescriptor(initial, property)
                Object.defineProperty(this, property, descriptor)
                
                const refProperty = initial.getRef(property)
                if(isRef(refProperty)) this.#refs[property] = refProperty
            }
        } else {
            this.#ref = toRef(initial)
        }

        for(const [property, options] of Object.entries(extension)){
            if(['ref', 'value', 'getRef'].includes(property)) continue

            const {
                value,
                enumerable,
                writable,
                readonly: isReadOnly = false
            } = options instanceof Options ? options : { value: options }

            if(isRef(value)) {
                const refProperty = isReadOnly ? readonly(value) : value
                this.#refs[property] = refProperty
                Object.defineProperty(this, property, {
                    enumerable: enumerable ?? false,
                    get() {
                        return refProperty.value
                    },
                    set(v) {
                        refProperty.value = v
                    }
                })
            } else if(typeof value === 'function') {
                Object.defineProperty(this, property, {
                    enumerable: enumerable ?? true,
                    writable: writable ?? false,
                    value: value.bind(this)
                })
            } else {
                Object.defineProperty(this, property, {
                    enumerable: enumerable ?? true,
                    writable: writable ?? true,
                    value: value
                })
            }
        }
    }
}

/**
 * Extends a ref with additional properties
 * 
 * @template T,E
 * @param { T | (() => T) | Ref<T> | ExtendedRef<T,F> } initial - The initial value or getter for the ref to be extended. A ref or extendedRef object may instead be provided.
 * @param { E | (withOptions: function) => E } [extension] - Extension object or callback that returns extension object. The extension object entries (key-value pairs) are the names and (initial) values of the extended properties, respectively.
 * 
 * @returns { ExtendedRef }
 * 
 * @example
 *  const extendedA = extendedRef('', { extra: 1 })
 *  // Access .value normally
 *  extendedA.value // ''
 *  // Access extended properties
 *  extendedA.extra // 1
 * 
 *  // Configure extended properties
 *  const extendedB = extendedRef(0, (withOptions) => ({
 *      extra1: 1,
 *      extra2: withOptions(2, { enumerable: false, writable: false }),
 *      extra3: withOptions(ref(3), { enumerable: true, readonly: true })
 *  }))
 */
function extendedRef(initial, extension){
    return markRaw(new ExtendedRef(initial, extension))
}

export {
    ExtendedRef,
    extendedRef
}