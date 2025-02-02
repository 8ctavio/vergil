import isPlainObject from "is-plain-obj"
import { onMounted, onUnmounted } from "vue"
import { isFunction } from "../../utilities"

export function createExposer(callback) {
    return function(target, source) {
        if(isPlainObject(target)) {
            onMounted(() => {
                const isExtensible = Object.isExtensible(target)
                if(isExtensible) {
                    for(const key of Object.getOwnPropertyNames(target)) {
                        delete target[key]
                    }
                }
                for(const prop of Object.keys(source)) {
                    const value = source[prop]
                    const descriptor = callback(value)
                    Object.defineProperty(target, prop, descriptor)
                }
                if(isExtensible) {
                    Object.preventExtensions(target)
                }
            })
            onUnmounted(() => {
                for(const prop of Object.keys(source)) {
                    Object.defineProperty(target, prop, {
                        value: undefined,
                        writable: false,
                        enumerable: !isFunction(source[prop]),
                        configurable: true
                    })
                }
            })
        }
    }
}