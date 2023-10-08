import { watch, toValue } from 'vue'
import { isWatchSource } from '.'

function watchUntil(sources, condition, { fulfill = true, timeout }){
    let stop = null
    const watcher = new Promise(resolve => {
        let flag = false
        stop = watch(sources, (newValues, oldValues) => {
            if(condition(newValues, oldValues) === fulfill){
                if(typeof stop === 'function'){
                    stop()
                    resolve()
                }
                else flag = true
            }
        }, { immediate: true })
        if(flag){
            stop()
            resolve()
        }
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
    const srcCase = Array.isArray(source) ? 3 : Array.isArray(toValue(source)) ? 2 : 1

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
        // One non-array watch source
        case 1:
            function toBe(value){
                if(isWatchSource(value)) return watchUntil([source, value], ([src,v]) => src === v, options)
                else return toMatch(src => src === value)
            }
            methods.toBe = toBe
            methods.toBeIn = value => {
                if(isWatchSource(value)) return watchUntil([source, value], ([src,v]) => v.includes(src), options)
                else return toMatch(src => value.includes(src))
            }
            methods.toBeNull = () => toBe(null)
            methods.toBeUndefined = () => toBe(undefined)
            methods.toBeTruthy = () => toMatch(Boolean)
            methods.toBeNaN = () => toMatch(Number.isNaN)
        break
        // One array watch source
        case 2:
            methods.toContain = value => {
                if(isWatchSource(value)) return watchUntil([source, value], ([src,v]) => src.includes(v), options)
                else return toMatch(src => src.includes(value))
            }
        break
        // Two or more watch sources
        case 3:
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
  
export function waitFor(source, options){
    return methodsGenerator(source, { ...options, fulfill: true })
}
export { waitFor as syncFor }