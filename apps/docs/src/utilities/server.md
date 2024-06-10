---
outline: [2,3]
---

# Server

> Server specific utility functions

## Usage

```js
import { <fn> } from '@8ctavio/vergil/server'
```

<!----------------------------------------------
-------------------- getDayStart --------------------
----------------------------------------------->
### `getDayStart`

> Gets a start of day timestamp (00:00:00.000) of another timestamps' date in a given timezone.

```js
function getDayStart(tzo: number, timestamp: number = Date.now()): number
```

#### Parameters

- **`tzo`** — Timezone offset in minutes.
- **`timestamp`** — Reference timestamp in milliseconds.

#### Return value

Start-of-day timestamp of the target-timezone-date with the provided timestamp.

<!---------------------------------------------------
-------------------- ServerError --------------------
---------------------------------------------------->
### `ServerError`

> Server specific (back-end) error.

```ts
class ServerError{
    code: string
    message: string
    details: {
        operation: string;
        cause?: string;
        reason?: string;
    }

    constructor (options: ServerError)
}
```

#### Parameters

- **`code`** — [FunctionsErrorCode](https://firebase.google.com/docs/reference/node/firebase.functions#functionserrorcode).
- **`message`**
- **`operation`** — Operation where error originated.
- **`cause`** — What caused the error.
- **`reason`** — Why was the error caused.

## Error handling

### `ServerErrorFactory`

Below is a template for a `ServerErrorFactory` class that helps generating `ServerError` messages of the form `"[ServerError] <Message title>: <Message details>"`, where the message title is based on the `operation` being performed and the message details depend on the `code`, `cause` and `reason`.

The developer should populate the objects inside the `throw` method to define messages for different `operation`s and `'code', 'cause', 'reason'` combinations. 

```js
// ServerErrorFactory.js
import { ServerError } from '@8ctavio/vergil/server'

/** Factory to throw `ServerError`s with custom messages */
export class ServerErrorFactory{
    #operation

    /**
     * @param { string } operation - Name of the client requested operation being performed
     */
    constructor(operation){
        this.updateOperation(operation)
    }

    /**
     * Updates `operation` name
     * 
     * @param { string } operation
     */
    updateOperation(operation){
        this.#operation = operation
    }

    /**
     * Throws a `ServerError` with a custom message of the form `"[ServerError] <Message title>: <Message details>"`.
     * 
     * @param { string } code - [FunctionsErrorCode](https://firebase.google.com/docs/reference/node/firebase.functions#functionserrorcode)
     * @param { string | Error } [cause] - What causes the error
     * @param { string } [reason] - Why was the error caused
     */
    throw(code, cause, reason){
        let message = "[ServerError] " + {
            '<operation>': "<Message title>"
        }[this.#operation] + ": "

        if(code === 'unknown'){
            /**
             * @TODO Log unknown errors somewhere for further revision
             */
            console.error(cause)
            message += `[${cause.name ?? 'UnknownError'}] ${cause.message}`
        }
        else{
            message += [code, cause, reason].reduce((obj, key) => typeof obj === 'object' ? obj[key ?? 'default'] : obj, {
                '<code>': {
                    '<cause>': {
                        '<reason>': "<Message details>",
                        default: "<Message details>"
                    },
                    default: "<Message details>"
                }
            })
        }
        throw new ServerError(code, message, { operation, cause, reason })
    }
}
```

Using `ServerErrorFactory` is the recommended way of handling and throwing errors in a server environment. It helps organize, simplify and standardize error throwing syntax and error message generation.

Next is a simple how-to-use example of the `ServerErrorFactory` class.

```js
import { ServerErrorFactory } from 'path/to/ServerErrorFactory.js'

function serverOperation(){
    const error = new ServerErrorFactory('server-operation')
    // later
    if(exception)
        error.throw('<code>', '<cause>', '<reason>')
}
```
