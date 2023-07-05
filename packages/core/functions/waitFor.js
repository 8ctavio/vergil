import { watch, isRef, toValue } from 'vue'

const isWatchSource = maybeWatchSource => isRef(maybeWatchSource) || (typeof maybeWatchSource === 'function')

function watchUntil(sources, condition, { fulfill = true, timeout }){
    let stop = null
    const watcher = new Promise(resolve => {
        stop = watch(sources, values => {
            if(condition(...values) === fulfill){
                stop?.()
                resolve()
            }
        }, { immediate: true })
    })

    const promises = [watcher]

    if(Number.isInteger(timeout)){
        promises.push(new Promise(resolve => {
            setTimeout(() => {
                stop?.()
                resolve()
            }, timeout)
        }))
    }

    return Promise.race(promises)
}

function methodsGenerator(source, options){
    const sources = Array.isArray(source) ? source : [source]

    let srcCase
    if(sources.length === 1) srcCase = Array.isArray(toValue(sources[0])) ? 2 : 1
    else srcCase = 3

    function toMatch(condition){
        return watchUntil(sources, condition, options)
    }

    const methods = { toMatch }

    if(options.fulfill) methods.toChange = (times = 1) => {
        let cont = 0
        if(isWatchSource(times)){
            let t = toValue(times)
            return watchUntil([
                , ...sources], v => {
                if(t === v) return ++cont > v
                else return cont > (t = v)
            }, options)
        }
        else return toMatch(() => ++cont > times)
    }

    switch(srcCase){
        // One non-array watch source
        case 1:
            function toBe(value){
                if(isWatchSource(value)) return watchUntil([sources[0], value], (v1,v2) => v1 === v2, options)
                else return toMatch(v => v === value)
            }
            methods.toBe = toBe
            methods.toBeIn = value => {
                if(isWatchSource(value)) return watchUntil([sources[0], value], (v1,v2) => v2.includes(v1), options)
                else return toMatch(v => value.includes(v))
            }
            methods.toBeNull = () => toBe(null)
            methods.toBeUndefined = () => toBe(undefined)
            methods.toBeTruthy = () => toMatch(Boolean)
            methods.toBeNaN = () => toMatch(Number.isNaN)
        break
        // One array watch source
        case 2:
            methods.toContain = value => {
                if(isWatchSource(value)) return watchUntil([sources[0], value], (v1,v2) => v1.includes(v2), options)
                else return toMatch(v => v.includes(value))
            }
        break
        // Two or more watch sources
        case 3:
            methods.toBeEqual = () => watchUntil(sources, (v1,...v2) => v2.every(v => v === v1), options)
        break
    }

    if(options.fulfill) Object.defineProperty(methods, 'not', {
        get(){
            return methodsGenerator(source, { ...options, fulfill: false })
        }
    })

    return methods
}
  
export function waitFor(source, options){
    return methodsGenerator(source, { ...options, fulfill: true })
}
export { waitFor as syncFor }