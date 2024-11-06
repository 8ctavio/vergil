import { watch } from 'vue'

/**
 * Watches `sources` until `callback` returns `true` or another configurable value.
 * 
 * @param { WatchSource<T> } sources
 * @param { WatchCallback } callback
 * @param { {
 *      fulfill: any;
 *      timeout: number;
 *      signal: AbortSignal;
 *      deep: number;
 *      flush: 'pre' | 'post' | 'sync';
 * } } options -
 *  - `fulfill`: `callback` return value that stops the watcher. Defaults to `true`.
 *  - `timeout`: Duration of watcher timeout in milliseconds. If set and `callback` is not fulfilled after `timeout` milliseconds, the watcher stops.
 *  - `signal`: `AbortSignal` to abort watcher with a corresponding [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
 * 
 * @returns { Promise<T> } A promise. Resolves to the `WatchSource` value that fulfilled the callback. If aborted, the promise rejects with the abort signal's abort reason (`signal.reason`).
 * 
 * @example
 * ```js
 * watchUnitl(src, (v,u) => {
 *     if(condition(v,u)){
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
        signal,
        ...watchOptions
    } = options

    if(signal?.aborted) return Promise.reject(signal.reason)

    const cleanup = []
    const promises = [
        new Promise((resolve, reject) => {
            let immediateStop = false
            const stop = watch(sources, (...args) => {
                if(callback(...args) === fulfill) {
                    immediateStop = true
                    cleanup.forEach(fn => fn())
                    resolve(args[0])
                }
            },{
                ...watchOptions,
                immediate: true,
                once: false
            })
            if(immediateStop) stop()
            else {
                cleanup.push(stop)
                if(signal) {
                    function abort() {
                        cleanup.forEach(fn => fn())
                        reject(signal.reason)
                    }
                    signal.addEventListener('abort', abort)
                    cleanup.push(() => {
                        signal.removeEventListener('abort', abort)
                    })
                }
            }
        })
    ]

    if(timeout) {
        promises.push(new Promise(resolve => {
            setTimeout(() => {
                cleanup.forEach(fn => fn())
                resolve()
            }, timeout)
        }))
    }

    return Promise.race(promises)
}