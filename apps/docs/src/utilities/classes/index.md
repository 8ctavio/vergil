---
outline: [2,3]
---

# Classes

## Usage

```js
import { <class> } from '@8ctavio/vergil'
```

## Error

<!------------------------------------------------
-------------------- AppError --------------------
------------------------------------------------->
### `AppError`

> Class to manage custom app (front-end) errors.

```ts
class AppError {
    type: string
    message: string | {
        title: string;
        details: string;
    }
    code: string
    details: object

    constructor({
        type: string,
        log: string,
        message: string | {
            title: string;
            details: string;
        },
        code: string = '',
        details: object
    })
}
```

#### Parameters

- **`type`** — Developer defined `AppError` type.
- **`code`** — Developer defined code. There may be different set of codes for different `type` values.
- **`details`** — `type` specific error details.
- **`log`** — Message to be logged in the console.
- **`message`** — User friendly message. As an object, `message` is separated in a `title` and `details`.

## Extended Reactivity

<!--------------------------------------------------------
-------------------- ExtendedReactive --------------------
--------------------------------------------------------->
### `ExtendedReactive`

> Defines accessor methods to read and write internally stored refs of automatically unwrapped reactive properties.

```ts
interface ExtendedReactive<T> {
    getRef: (property?: keyof T) => Ref | undefined;
    setRef: (property?: keyof T, refProperty: Ref) => void;
    [P in keyof T]: T[P];
}
```

<!---------------------------------------------------
-------------------- ExtendedRef --------------------
---------------------------------------------------->
### `ExtendedRef`

> Defines a `ref` property to store a ref object and `value` accessor methods to read from and write to that ref's value.

```ts
interface ExtendedRef<T,E> extends ExtendedReactive<E> {
    ref: Ref<T>;
    value: T;
}
```