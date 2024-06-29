import { toRef, isRef, readonly, markRaw } from 'vue'

/** Object property's descriptor */
class Descriptor {
    constructor(requestor, { value, enumerable, writable, readonly: isReadOnly }){
        if(isRef(value)){
            this.enumerable = enumerable ?? false
            if(isReadOnly) value = readonly(value)
            this.get = function(){
                return value.value
            }
            this.set = function(v){
                value.value = v
            }
            this.value = value
        }
        else{
            this.enumerable = enumerable ?? true
            if(typeof value === 'function'){
                this.writable = writable ?? false
                this.value = value.bind(requestor)
            }
            else{
                this.writable = writable ?? true
                this.value = value
            }
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
        if(typeof extension === 'function'){
            extension = extension((value, options) => new Descriptor(this, { ...options, value }))
        }
        if(typeof extension !== 'object' || extension === null){
            throw new TypeError("Invalid value for 'extension' parameter")
        }

        if(initial instanceof ExtendedRef){
            // Extend ExtendedRef
            this.#ref = initial.ref
            for(const property of Object.getOwnPropertyNames(initial)){
                if(['__v_skip'].includes(property)) continue

                const descriptor = Object.getOwnPropertyDescriptor(initial, property)
                Object.defineProperty(this, property, descriptor)
                
                const propertyRef = initial.getRef(property)
                if(isRef(propertyRef)) this.#refs[property] = propertyRef
            }
        }
        else{
            this.#ref = toRef(initial)
        }

        for(const [property, value] of Object.entries(extension)){
            if(['ref', 'value', 'getRef'].includes(property)) continue

            const descriptor = value instanceof Descriptor ? value : new Descriptor(this, { value })
            if(isRef(descriptor.value)){
                this.#refs[property] = descriptor.value
                delete descriptor.value
            }
            Object.defineProperty(this, property, descriptor)
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
 *      extra1: withOptions(1, { enumerable: false, writable: false }),
 *      extra2: withOptions(ref(2), { enumerable: true, readonly: true })
 *  }))
 */
function extendedRef(initial, extension){
    return markRaw(new ExtendedRef(initial, extension))
}

export {
    ExtendedRef,
    extendedRef
}