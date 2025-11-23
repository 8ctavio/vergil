---
outline: [2,3]
---

# `useDebounce`

> Creates a debounced function.

<script setup>
import { Btn } from 'vergil/components'
import { useDebounce, toast } from 'vergil'

const debounced = useDebounce(() => {
	toast('🤖')
}, 500)
</script>

## Demo

<Demo>
	<Btn @click="debounced" label="Debounced Toast"/>
</Demo>

```vue
<script setup>
import { useDebounce } from '@8ctavio/vergil'

const debounced = useDebounce(() => {
	toast('🤖')
}, 500)
</script>

<template>
	<Btn @click="debounced" label="Debounced Toast"/>
</template>
```

## Definition

```ts
interface Debounced {
    (this: unknown, ...args: unknown[]): void;
    cancel: () => void;
}

function useDebounce(
    fn: Function,
    minWait: MaybeRefOrGetter<number>,
    options?: {
        eager?: MaybeRefOrGetter<boolean>;
    }
): Debounced
```

#### Parameters

- **`fn`** — Function to debounce.
- **`minWait`** — Time in milliseconds to wait before executing `fn` since the debounced function's last call.
- `options`
    - **`eager`** — When set to `true`, `fn` is executed as soon as the debounced function is called *if* `fn` is not scheduled and `minWait` milliseconds have elapsed since `fn`'s last execution (or `fn` has not been executed). Defaults to `false`.

#### Return value

Debounced function with `cancel` method to cancel scheduled `fn` execution.