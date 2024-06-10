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