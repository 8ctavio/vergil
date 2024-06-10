import { watch, nextTick } from 'vue'

/**
 * Watches `sources` until `callback` returns `true` or another configurable value.
 * 
 * @param { WatchSource<T> } sources
 * @param { WatchCallback } callback
 * @param { {
 *      fulfill: any;
 *      timeout: number;
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
export function watchUntil(sources, callback, { fulfill = true, timeout } = { fulfill: true }){
    let stop = () => {}
    const watcher = new Promise(resolve => {
        stop = watch(sources, (newValues, oldValues) => {
            if(callback(newValues, oldValues) === fulfill){
                nextTick(() => stop())
                resolve(newValues)
            }
        }, { immediate: true })
    })

    const promises = [watcher]

    if(Number.isInteger(timeout)){
        promises.push(new Promise(resolve => {
            setTimeout(() => {
                stop()
                resolve()
            }, timeout)
        }))
    }

    return Promise.race(promises)
}