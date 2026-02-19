---
outline: [2,3]
---

# `watchControlled`

> Watcher with pause and resume controls to ignore source updates. Source updates do not trigger a paused watcher.

## Usage

```js
import { watchControlled } from '@vrgl/vergil'

const source = ref(0)
const watcher = watchControlled(source, v => {
    console.log(`new value: ${v}`)
})

// Normally trigger watcher
source.value++ // 'new value: 1'

// Ignore updates by pausing watcher
watcher.pause()
// Does not trigger watcher
source.value++
watcher.resume()

// Ignore updates with callback
watcher.ignore(() => {
    // Does not trigger watcher
    source.value++
})

// Stop watcher
watcher.stop()
```

## Definition

```ts
// Single watch source
function watchControlled<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchControlledOptions
): WatchControlledHandle

// Multiple watch sources
function watchControlled<T>(
    source: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchControlledOptions
): WatchControlledHandle

type WatchControlledOptions = WatchOptions & {
    nonPreemptive?: boolean
}

interface WatchControlledHandle {
    stop(): void;
    pause(): void;
    resume(): void;
    ignore(callback: () => void): void;
}
```

#### Parameters

- **options**:
    - **`nonPreemptive`**: Whether to execute the scheduled callback regardless of the watcher's paused state. Defaults to `false`.

#### Return value

An object with the following methods:

- `stop`: Stops watcher.
- `pause`: Pauses watcher. Source updates do not trigger paused watchers.
- `resume`: Resumes watcher.
- `ignore`: Pauses watcher, runs provided callback, and resumes watcher.