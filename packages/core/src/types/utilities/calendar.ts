import type { MaybeArray } from "#utilities"

export type CalendarDate = string | number | Date

export type CalendarModelDate = MaybeArray<CalendarDate> | null

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6