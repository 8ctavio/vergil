import { isWatchSource } from '../functions'
import { watchUntil } from './watchUntil'

function waitFor(source, options){
    return methodsGenerator(source, { ...options, fulfill: true })
}

function methodsGenerator(source, options){
    const srcCase = Array.isArray(source) ? 2 : 1

    function toMatch(condition){
        return watchUntil(source, condition, options)
    }

    const methods = { toMatch }

    if(options.fulfill) methods.toChange = (times = 1) => {
        let cont = 0
        if(isWatchSource(times)){
            const sources = Array.isArray(source) ? [times, ...source] : [times, source]
            return watchUntil(sources, ([newTimes], [oldTimes]) => {
                if(newTimes === oldTimes) return ++cont > newTimes
                else return cont > newTimes
            }, options)
        }
        else return toMatch(() => ++cont > times)
    }

    switch(srcCase){
        // One watch source
        case 1:
            function toBe(value){
                if(isWatchSource(value)) return watchUntil([source, value], ([src,v]) => src === v, options)
                else return toMatch(src => src === value)
            }
            methods.toBe = toBe
            methods.toBeIn = value => {
                if(isWatchSource(value)) return watchUntil([source, value], ([src,v]) => Array.isArray(v) && v.includes(src), options)
                else return toMatch(src => value.includes(src))
            }
            methods.toBeNull = () => toBe(null)
            methods.toBeUndefined = () => toBe(undefined)
            methods.toBeTruthy = () => toMatch(Boolean)
            methods.toBeNaN = () => toMatch(Number.isNaN)   
            methods.toContain = value => {
                if(isWatchSource(value)) return watchUntil([source, value], ([src,v]) => Array.isArray(src) && src.includes(v), options)
                else return toMatch(src => src.includes(value))
            }
        break
        // Two or more watch sources
        case 2:
            methods.toBeEqual = () => watchUntil(source, ([v1,...v2]) => v2.every(v => v === v1), options)
        break
    }

    if(options.fulfill) Object.defineProperty(methods, 'not', {
        get(){
            return methodsGenerator(source, { ...options, fulfill: false })
        }
    })

    return methods
}
   
export {
    waitFor,
    waitFor as syncFor
}