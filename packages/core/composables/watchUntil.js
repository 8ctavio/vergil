import { watch } from 'vue'

/**
 * Watches `sources` until `callback` returns `true` or another configurable value.
 * 
 * @param { WatchSource<T> } sources
 * @param { WatchCallback } callback
 * @param { {
 *      fulfill: any;
 *      timeout: number;
 *      deep: number;
*       flush: 'pre' | 'post' | 'sync';
 * } } options -
 *  - `fulfill`: `callback` return value that stops the watcher. Defaults to `true`.
 *  - `timeout`: Duration of watcher timeout in milliseconds. If set and `callback` is not fulfilled after `timeout` milliseconds, the watcher stops.
 * 
 * @returns { Promise<T> } A promise. Resolves to WatchSource value that fulfilled the callback.
 * 
 * @example
 * ```js
 * watchUnitl(src, (v, oldV) => {
 *     if(condition(v, oldV)){
 *         // ...
 *         return true  // watchUntil resolves to v
 *     }
 * })
 * ```
 */
export function watchUntil(sources, callback, options = {}){
    const {
        fulfill = true,
        timeout = 0,
        ...watchOptions
    } = options

    let stop
    const promises = [
        new Promise(resolve => {
            let immediateStop = false
            stop = watch(sources, (...args) => {
                if(callback(...args) === fulfill) {
                    if(stop) stop()
                    else immediateStop = true
                    resolve(args[0])
                }
            },{
                ...watchOptions,
                immediate: true,
                once: false
            })
            if(immediateStop) stop()
        })
    ]

    if(timeout) {
        promises.push(new Promise(resolve => {
            setTimeout(() => {
                stop()
                resolve()
            }, timeout)
        }))
    }

    return Promise.race(promises)
}