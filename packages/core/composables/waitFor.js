import { isWatchSource } from '../functions'
import { watchUntil } from './watchUntil'

/**
 * Watches `source` until a condition is fulfilled. The condition can be specified as a chained method.
 * @alias `syncFor`
 * 
 * @param { WatchSource<T> } source 
 * @param { { timeout: number; } } options
 *  - `timeout`: Duration of watcher timeout in milliseconds. If set and condition is not fulfilled after `timeout` milliseconds, the watcher stops.
 * 
 * @returns { {
 *      toBe: (value: any) => Promise<T>;
 *      toBeEqual: () => Promise<T>;
 *      toBeIn: (arr: Array) => Promise<T>;
 *      toBeNaN: () => Promise<T>;
 *      toBeNull: () => Promise<T>;
 *      toBeTruthy: () => Promise<T>;
 *      toBeUndefined: () => Promise<T>;
 *      toChange: (n: number) => Promise<T>;
 *      toContain: (value: any) => Promise<T>;
 *      toMatch: (condition: function) => Promise<T>;
 *      not: {
 *          toBe: (value: any) => Promise<T>;
 *          toBeEqual: () => Promise<T>;
 *          toBeIn: (arr: Array) => Promise<T>;
 *          toBeNaN: () => Promise<T>;
 *          toBeNull: () => Promise<T>;
 *          toBeTruthy: () => Promise<T>;
 *          toBeUndefined: () => Promise<T>;
 *          toContain: (value: any) => Promise<T>;
 *          toMatch: (condition: function) => Promise<T>;
 *      };
 * } } 
 * Condition methods. Available methods are:
 *  - `.toMatch(condition: WatchCallback)`
 *  - `.toChange(nTimes: number)`
 *  - For a single watch source:
 *      - `.toBe(equalTo: any)`
 *      - `.toBeIn(arr: Array)`
 *      - `.toBeNull()`
 *      - `.toBeUndefined()`
 *      - `.toBeTruthy()`
 *      - `.toBeNaN()`
 *      - `.toContain(value: any)`
 *  - For two or more watch sources:
 *      - `toBeEqual()`
 * 
 * Additionally, condition methods (except for `.toChange`) can be prefixed with `.not` in order to negate the condition.
 * 
 * @example
 * ```js
 * waitFor(src).toBe(true).then(() => {
 *      // Do something when toValue(src) === true
 * })
 * 
 * // Wait until [1,2,3].includeS(toValue(src))
 * await syncFor(src).toBeIn([1,2,3])
 * 
 * // Wait until toValue(src) !== null
 * await syncFor(src).not.toBeNull()
 * ```
 */
function waitFor(source, options){
    return methodsGenerator(source, { ...options, fulfill: true })
}

function methodsGenerator(source, options){
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

    // Two or more watch sources
    if(Array.isArray(source) && source.length > 1){
        methods.toBeEqual = () => watchUntil(source, ([v1,...v2]) => v2.every(v => v === v1), options)
    }
    // One watch source
    else{
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