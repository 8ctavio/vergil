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