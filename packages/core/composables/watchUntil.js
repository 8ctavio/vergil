import { watch, nextTick } from 'vue'

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