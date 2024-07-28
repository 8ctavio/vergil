//-----------------------------------------------
//-------------------- ERROR --------------------
//-----------------------------------------------
/** Server specific (back-end) error */
export class ServerError {
    /**
     * @param { string } message - Human readable error description
     * @param { string } operation - Name of operation where error originated
     * @param { string } code - A firebase functions' [FunctionsErrorCode](https://firebase.google.com/docs/reference/node/firebase.functions#functionserrorcode)
     * @param { (string | Error)[] } [causes] - Deductively ordered error causes
     */
    constructor(message, operation, code, causes){
        this.message = message
        this.operation = operation
        this.code = code
        this.causes = causes
    }
}