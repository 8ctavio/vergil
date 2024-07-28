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