import { getTimestamp } from '.'

//----------------------------------------------
//-------------------- DATE --------------------
//----------------------------------------------
/**
 * Gets a start of day timestamp (00:00:00.000) of another timestamps' date in a given timezone.
 * 
 * @param { number } tzo - Timezone offset in minutes 
 * @param { number } timestamp - Reference timestamp in milliseconds. Defaults to `Date.now()`
 * @returns { number } Start-of-day timestamp of the target-timezone-date with the provided timestamp
 */
export function getDayStart(tzo, timestamp = Date.now()){
    const dayUTC = new Date(getTimestamp({
        from: timestamp,
        offset: { d: Math.sign(-tzo), m: tzo } 
    }))
    dayUTC.setUTCHours(0,0,0,0)
    return getTimestamp({
        from: dayUTC.getTime(),
        offset: { d: Math.sign(tzo), m: -tzo } 
    })
}

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