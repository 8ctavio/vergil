import { isRef } from 'vue'

const isWatchSource = maybeWatchSource => isRef(maybeWatchSource) || (typeof maybeWatchSource === 'function')

export{
    isWatchSource
}