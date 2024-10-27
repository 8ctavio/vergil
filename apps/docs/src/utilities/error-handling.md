---
outline: [2,3]
---

# Error handling

Handling and coordinating errors and their messages between server and client applications can quickly become chaotic and non-scalable if not using some kind of convention.

When the server throws an error, it should include a clear and concise message for the developer to easily review it. Likewise, it may be desired to report a corresponding user-friendly message to the client to inform in simple terms the problems encountered by the application.

Therefore, it is required to implement a way to generate environment specific messages of uniquely identified server errors.

In order to simplify, organize and standardize error throwing syntax and error message generation, Vergil recommends taking the following measurements.

### Server side

A `ServerErrorFactory` class that helps to generate [`ServerError`](/utilities/classes/server#servererror)s with messages of the form `"[ServerError] <Message title>: <Message details>"`, where the message title is based on the `operation` being performed and the message details depend on the `code` and `causes`.

Basic usage is shown below:

```js
import { ServerErrorFactory } from 'path/to/ServerErrorFactory.js'
const serverError = new ServerErrorFactory('<operation-name>')
// later
if(exception)
    serverError.throw('<code>', ...['<causes>'])
```

This way, `ServerError`s are uniquely identified by the sequence of `code, ...causes`. The `operation` only serves to inform where the error came from (what was the server doing).

It is recommended to use a firebase functions' [FunctionsErrorCode](https://firebase.google.com/docs/reference/node/firebase.functions#functionserrorcode) for the `ServerError` `code`. In any case, the developer should suggest short and simple *cause* codes to accurately and semantically describe the error.

It is important to note as well that the ordered sequence `code, ...causes` should be designed to deductively describe the error, i.e., when traversing the sequence from left to right, it should communicate with increasing specificity the reasons why the error ocurred.

The developer should then define message titles for each operation and message details (content) for different `code, ...causes` combinations.

Below is a template for the `ServerErrorFactory` class where the developer can populate the objects inside the `throw` method with custom messages.

:::tip
`ServerErrorFactory.throw` messages should be designed to be reviewed by developers.
:::

:::tip
Unlimited `causes` can be defined for flexibility. However, defining many long `causes` sequences may result difficult to mantain. For most cases, it is recommended to define at most three `causes`.
:::

```js
// ServerErrorFactory.js
import { ServerError } from '@8ctavio/vergil/utilities'

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
     * @param { (string | Error)[] } [causes] - Deductively ordered error causes
     */
    throw(code, ...causes){
        // ----- Message titles -----
        let message = "[ServerError] " + {
            '<operation>': "<Message title>"
        }[this.#operation] + ": "

        if(code === 'unknown'){
            const error = causes[0]
            /**
             * @TODO Log unknown errors somewhere for further revision
             */
            console.error(error)
            message += `[${error.name ?? 'UnknownError'}] ${error.message}`
        }
        else{
            // ----- Message details -----
            message += [code, ...causes].reduce((obj, key) => typeof obj === 'object' ? obj[key ?? 'default'] : obj, {
                '<code>': {
                    '<cause>': "<Message details>",
                    '<cause>': {
                        '<cause>': "<Message details>",
                        default: "<Message details>"
                    },
                    default: "<Message details>"
                }
            }) + '.'
        }
        throw new ServerError(message, this.#operation, code, causes)
    }
}
```

Consider, for instance, a `create-note` operation that receives a `title` and `content`. These are some possible `code, cause, ...details` combinations:

- `error.throw('invalid-argument', 'note', 'title')`
- `error.throw('invalid-argument', 'note', 'title', 'empty')`
- `error.throw('invalid-argument', 'note', 'title', 'too-long')`
- `error.throw('invalid-argument', 'note', 'content')`

The objects in the `ServerErrorFactory.throw` method might look something like this:

```js
// Message titles
{
    'create-note': 'Could not create note'
}

// Message details
{
    'invalid-argument': {
        'note': {
            'title': {
                'empty': 'Sent an empty note title',
                'too-long': 'Note title cannot exceed 50 characters',
                default: 'Sent an invalid note title'
            },
            'content': 'Sent invalid note content'
        }
    }
}
```

Lastly, as seen in the `ServerErrorFactory.throw` method implementation, there is a special case for `code = 'unknown'` where the first cause is expected to be the unknown error.

```js
try{
    // Perform server operation
}
catch(error){
    serverError.throw('unknown', error)
}
```

### Client side

When an error coming from the server (should be a `ServerError`) is caught in the client, use a `getServerErrorMessage` function to generate a `message` for an [`AppError`](/utilities/classes/index.md#apperror) with `type = 'server'`.

Basic usage is shown below:

```js
import { AppError } from '@8ctavio/vergil/utilities'

// caught error from server call
catch(error){
    throw new AppError({
        type: 'server',
        code: error.code,
        details: {
            operation: error.operation,
            causes: error.causes
        },
        log: error.message, // Note AppError logs ServerError developer message in the console
        message: getServerErrorMessage(error.operation, error.code, error.causes)
    })
}
```

Implementation of the `getServerErrorMessage` is similar to that of the `ServerErrorFactory.throw` method. Below is a template for the `getServerErrorMessage` function where the developer can define messages for server operations and uniquely identified errors.

:::tip
`getServerErrorMessage` messages should be designed to be clearly understood by users.
:::

```js
function getServerErrorMessage(operation, code, causes){
    return {
        title: {
            '<operation>': '<Message title>'
        }[operation],
        details: [code, ...causes].reduce((obj, key) => typeof obj === 'object' ? obj[key ?? 'default'] : obj, {
            '<code>': {
                '<cause>': "<Message details>",
                '<cause>': {
                    '<cause>': "<Message details>",
                    default: "<Message details>"
                },
                default: "<Message details>"
            }
        }) + '.'
    }
}
```

How to display the `AppError` message is left to the developer. An option is, for instance, to use the object returned by `getServerErrorMessage` as props for a [`Toast`](/components/toast) component.