---
outline: [2,3]
---

# Server Classes

## Usage

```js
import { <class> } from '@8ctavio/vergil/server'
```

## Error

<!---------------------------------------------------
-------------------- ServerError --------------------
---------------------------------------------------->
### `ServerError`

> Server specific (back-end) error.

```ts
class ServerError{
    message: string
    operation: string
    code: string
    causes?: (string | Error)[]

    constructor (options: ServerError)
}
```

#### Parameters

- **`message`** — Human readable error description
- **`operation`** — Name of operation where error originated.
- **`code`** — A firebase functions' [FunctionsErrorCode](https://firebase.google.com/docs/reference/node/firebase.functions#functionserrorcode).
- **`cause`** — Deductively ordered error causes.