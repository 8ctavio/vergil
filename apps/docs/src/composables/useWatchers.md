---
outline: [2,3]
---

# `useWatchers`

> Allows to create multiple watchers for the same source and to pause and resume them to ignore source updates.

## Usage

```js
import { useWatchers } from '@8ctavio/vergil'

const source = ref(0)
const watchers = useWatchers(source)

// Register callbacks
watchers.onUpdated(v => {
	console.log(`new value: ${v}`)
})
watchers.onUpdated((v,u) => {
	console.log(`old value: ${u}`)
})

// Normally trigger watcher callbacks
source.value++ // 'new value: 1', 'old value: 0'

// Ignore updates by pausing callbacks
watchers.pause()
// Does not trigger watcher callbacks
source.value++
watchers.resume()

// Ignore updates with callback
watchers.ignore(() => {
    // Does not trigger watcher callbacks
    source.value++
})

// Stop watching
watchers.stop()
```

## Definition

```ts
// Single watch source
function useWatchers<T>(
    source: WatchSource<T>,
    options?: { deep?: boolean | number }
): WatchControlledHandle & {
    onUpdated(
        callback: WatchCallback<T, T | undefined>,
        options?: Omit<WatchOptions, 'deep'>
    ): () => void;
}

// Multiple watch sources
function useWatchers<T>(
    source: WatchSource<T>[],
    options?: { deep?: boolean | number }
): WatchControlledHandle & {
    onUpdated(
        callback: WatchCallback<T[], (T | undefined)[]>,
        options?: Omit<WatchOptions, 'deep'>
    ): () => void;
}

type WatchControlledHandle = {
    stop(): void;
    pause(): void;
    resume(): void;
    ignore(callback: () => void): void;
}
```

#### Parameters

- **`source`**: Source or array of sources to watch.
- **`options`**
    - `deep`: Whether to deeply watch sources.

#### Return value

An object with the following methods:

- `onUpdated`: Creates a new watcher for `source`. It accepts as arguments the watcher's callback function and options object; the `deep` option is taken from `useWatchers` options. The `onUpdated`'s returned function stops the created watcher.
- `pause`: Pauses watchers. Source updates do not trigger paused watcher callbacks.
- `resume`: Resumes watchers.
- `ignore`: Pauses watchers, runs provided callback, and resumes watchers.
- `stop`: Stops watchers.