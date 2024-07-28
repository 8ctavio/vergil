//-----------------------------------------------
//-------------------- ERROR --------------------
//-----------------------------------------------
/** Class to manage custom app (front-end) errors */
export class AppError{
    /**
     * @param { {
     *      type: string
     *      code: string
     *      details: object
     *      log: string
     *      message: string | { title: string, details: string }
     * } } options -
     * - `type`: Developer defined `AppError` type (e.g. `'server'`)
     * - `code`: Developer defined code. There may be different set of codes for different `type` values
     * - `details`: `type` specific error details
     * - `log`: Message to be logged in the console
     * - `message`: User friendly message. As an object, `message` is separated in a `title` and `details`
     */
    constructor({ type, log, message, code = '', details }){
        this.type = type
        this.message = message
        this.code = code
        this.details = details
        const errorLog = `∮ [AppError: ${type}] — ${log}`
        if(this.type === 'server'){
            console.error(`${errorLog}\n\n`, {
                operation: details.operation,
                code,
                cause: details.cause,
                reason: details.reason
            })
        }
        else console.error(errorLog)
    }
}