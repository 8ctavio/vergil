---
outline: [2,3]
---

# `watchControlled`

> Watcher with pause and resume controls to ignore source updates. Source updates do not trigger a paused watcher.

## Usage

```js
import { watchController } from '@8ctavio/vergil'

const source = ref(0)
const controller = watchControlled(source, v => {
    console.log(`new value: ${v}`)
})

// Normally trigger watch
source.value++ // 'new value: 1'

// Ignore updates by pausing watcher
controller.pause()
// Does not trigger watch
source.value++
controller.resume()

// Ignore updates with callback
controller.ignore(() => {
    // Does not trigger watch
    source.value++
})

// Stop watcher
controller.stop()
```

## Definition

```js
function watchController<T>(
    sources: WatchSource<T>,
    callback: WatchCallback<T>,
    options: WatchOptions
): {
    stop: () => void;
    pause: () => void;
    resume: () => void;
    ignore: (cb: () => void) => void;
}
```

#### Parameters

Same as a regular watcher.

#### Return value

A watcher controller object with the following methods:

- `stop`: Stops watcher.
- `pause`: Pauses watcher. Source updates do not trigger paused watchers.
- `resume`: Resumes watcher.
- `ignore`: Pauses watcher, runs provided callback, and resumes watcher.