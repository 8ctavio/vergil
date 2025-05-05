import { MaybeArray } from "."

export type DateComponents<UpToMonth extends boolean = false> = UpToMonth extends true
	? [number, number, number?]
	: [number, number, number]

export type CalendarDate = string | number | Date

export type CalendarModelDate = MaybeArray<CalendarDate> | null

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6