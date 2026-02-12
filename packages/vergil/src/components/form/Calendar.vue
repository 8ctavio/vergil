<script lang="ts">
import { isDate, padLeadingZeros } from '#utilities'
import { hasDate } from './Calendar/utils'
import type { CalendarDate } from './Calendar/public.types'
import type { DateComponents } from './Calendar/internal.types'

const reTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/
const MIN_DATE = '1970-01-01'
const MIN_DATE_COMPONENTS = normalizeCalendarDate(MIN_DATE)!
const MAX_DATE = '2131-12-31'
const MAX_DATE_COMPONENTS = normalizeCalendarDate(MAX_DATE)!

function normalizeCalendarDate<T extends boolean = false>(date: CalendarDate | null, asDate?: T): T extends true ? Date : DateComponents | null
function normalizeCalendarDate(date: CalendarDate | null, asDate = false) {
	if (date === 'today') {
		(date = new Date()).setHours(0,0,0,0)
	} else if (typeof date === 'string') {
		// When the time zone offset is absent, date-only forms are interpreted as a UTC time and date-time forms are interpreted as a local time.
		// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
		if (date[10] !== 'T') date += "T00:00"
		date = new Date(date)
	} else if (!isDate(date)) {
		date = new Date(date === null ? NaN : date)
	}

	return asDate ? date : Number.isNaN(date.getTime())
		? null
		: [date.getFullYear(), date.getMonth(), date.getDate()] as DateComponents
}
function formatCalendarDate(date: DateComponents) {
	return `${padLeadingZeros(date[0], 4)}-${padLeadingZeros(date[1]+1)}-${padLeadingZeros(date[2])}`
}
function isValidCalendarDate(date: CalendarDate) {
	return !Number.isNaN(normalizeCalendarDate(date, true).getTime())
}

function compareDates<UpToMonth extends boolean>(
	date1: Readonly<DateComponents<UpToMonth>>,
	date2: Readonly<DateComponents<UpToMonth>>,
	upToMonth?: UpToMonth
) {
	const limit = upToMonth ? 2 : 3
	for (let i=0; i<limit; i++) {
		if (date1[i]! > date2[i]!) {
			return 1
		} else if (date1[i]! < date2[i]!) {
			return -1
		}
	}
	return 0
}

function isDateWithinRange<UpToMonth extends boolean>(
	date: Readonly<DateComponents<UpToMonth>>,
	min: Readonly<DateComponents<UpToMonth>>,
	max: Readonly<DateComponents<UpToMonth>>,
	upToMonth?: UpToMonth
) {
	return (compareDates(date, min, upToMonth) > -1) && (compareDates(date, max, upToMonth) < 1)
}

function getCalendarMeta(displayedYear: number, displayedMonth: number, firstWeekday: number) {
	const auxDate = new Date(`${padLeadingZeros(displayedYear, 4)}-${padLeadingZeros(displayedMonth+1)}-01`)
	const currMonthFirstWeekday = auxDate.getUTCDay()
	auxDate.setUTCMonth(auxDate.getUTCMonth() + 1, 0)

	const firstDate: number[] = []
	const lastDate: number[] = []
	const stages = {
		prev: null as null | {
			date: [number, number];
			firstDate: number;
			lastDate: number;
		},
		current: {
			date: [displayedYear, displayedMonth],
			firstDate: 1,
			lastDate: auxDate.getUTCDate(),
		},
		next: null as null | {
			date: [number, number];
			firstDate: number;
			lastDate: number;
		}
	}
	let totalDays = stages.current.lastDate
	let extraDays

	if (currMonthFirstWeekday !== firstWeekday) {
		auxDate.setUTCDate(0)
		const prevMonthLastDate = auxDate.getUTCDate()
		// @ts-expect-error
		extraDays = currMonthFirstWeekday - firstWeekday + (currMonthFirstWeekday < firstWeekday && 7)
		totalDays += extraDays
		stages.prev = {
			date: [auxDate.getUTCFullYear(), auxDate.getUTCMonth()],
			firstDate: prevMonthLastDate - extraDays + 1,
			lastDate: prevMonthLastDate,
		}
		firstDate.push(...stages.prev.date, stages.prev.firstDate)
	} else {
		firstDate.push(...stages.current.date, stages.current.firstDate)
	}

	extraDays = 7 - (totalDays % 7)
	if (extraDays < 7) {
		totalDays += extraDays
		stages.next = {
			date: displayedMonth === 11
				? [displayedYear + 1, 0]
				: [displayedYear, displayedMonth + 1],
			firstDate: 1,
			lastDate: extraDays
		}
		lastDate.push(...stages.next.date, stages.next.lastDate)
	} else {
		lastDate.push(...stages.current.date, stages.current.lastDate)
	}

	return { firstDate, lastDate, stages, totalDays } as {
		firstDate: DateComponents;
		lastDate: DateComponents;
		stages: typeof stages;
		totalDays: number;
	}
}

function normalizeModelDates(model: ModelWrapper<CalendarDate[]>, mods: Record<string, boolean>, timeControls: boolean | string | undefined, hours: number, minutes: number, callback: (date: DateComponents) => void) {
	const modelValue = toRaw(model.value)
	for (let i=0; i<modelValue.length; i++) {
		let newValue
		const currDate = normalizeCalendarDate(modelValue[i]!, true)
		const currDateComponents = normalizeCalendarDate(currDate)
		const prevTimestamp = currDate.getTime()
		if (currDateComponents === null) {
			if (i === (modelValue.length - 1)) {
				do modelValue.pop()
				while (modelValue.length > 0 && modelValue[--i] === undefined)
				triggerRef(model.ref)
				break
			}
		} else {
			let time = ''
			if (timeControls) {
				currDate.setHours(hours, minutes, 0,0)
				time = `T${padLeadingZeros(hours)}:${padLeadingZeros(minutes)}`
			} else {
				currDate.setHours(0,0,0,0)
			}

			if (mods.string) {
				newValue = formatCalendarDate(currDateComponents) + time
			} else if (mods.timestamp) {
				newValue = currDate.getTime()
			} else {
				newValue = currDate
			}

			callback(currDateComponents)
		}
		
		if (!Object.is(newValue, modelValue[i])) {
			modelValue[i] = newValue!
			triggerRef(model.ref)
		} else if (isDate(newValue) && prevTimestamp !== newValue.getTime()) {
			triggerRef(model.ref)
		} 
	}
}

function focusAdjacentSibling(parent: HTMLElement, idx: number, direction: string, columns: number, isWrapped = false) {
	if (direction === 'Left') {
		idx--
	} else if (direction === 'Right') {
		idx++
	} else if (direction === 'Up') {
		idx -= columns
	} else if (direction === 'Down') {
		idx += columns
	}
	if (idx >= 0 && idx < parent.childElementCount) {
		const el = parent.children.item(idx) as HTMLElement
		if (isWrapped) {
			if (el) (el.firstElementChild as HTMLElement).focus()
		} else {
			el?.focus()
		}
	}
}
function focusFirstChild(root: HTMLElement, isWrapped = false) {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, isWrapped
		? el => ((el as HTMLElement).firstElementChild as HTMLInputElement).disabled ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
		: el => (el as HTMLInputElement).disabled ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
	)
	return (walker.firstChild() as HTMLElement)?.focus()
}

//-------------------- GENERATORS --------------------
function* generateYears(firstYear: number) {
	const lastYear = firstYear + 15
	for (let y=firstYear; y<lastYear; y++) {
		yield y
	}
}
function* generateWeekdays(firstWeekday: number) {
	let weekday = firstWeekday
	for (let i=0; i<7; i++) {
		yield weekday++
		if (weekday === 7) weekday = 0
	}
}
function* generateIntegers(from: number, to: number, step = 1) {
	let i = from
	while (true) {
		if (from < to) {
			if (i > to) break
			yield i
			i += step
		} else {
			if (i < to) break
			yield i
			i -= step
		}
	}
}
</script>

<script setup lang="ts">
import { computed, shallowRef, triggerRef, useTemplateRef, toRaw, nextTick } from 'vue'
import { vergil } from '#vergil'
import { useModel, useDefineModel, useDefineElements } from '#composables'
import {
	isFunction, ucFirst, everyKeyInObject, clamp, isInput, isEscapeKey,
	inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme
} from '#utilities'
import Icon from '#components/Icon'
import Btn from '#components/Btn.vue'
import InputText from '#components/form/InputText.vue'
import Slider from '#components/form/Slider.vue'
import type { PropType } from 'vue'
import type { ModelWrapper, ModelValueProp, ModelValidatorProp, Elements  } from "#composables"
import type { MaybeArray, TupleOf, Theme, Size, Radius, Spacing } from "#utilities"
import type { CalendarModelDate, Weekday } from './Calendar/public.types'

type TimeControls = {
	min?: number;
	max?: number;
	step?: number;
}

const props = defineProps({
	//----- Model -----
    value: {
        type: [Object, String, Number] as PropType<CalendarModelDate>,
        default: null
    },
    modelValue: {
        type: [Object, String, Number] as ModelValueProp<CalendarModelDate>,
        default: (props: { value: CalendarModelDate }) => props.value
    },
	modelModifiers: {
		type: Object,
		default: () => ({})
	},
    ['onUpdate:modelValue']: Function,
    validator: Function as ModelValidatorProp<CalendarModelDate>,
	eagerValidation: Boolean,
    elements: Object as PropType<Elements>,

	locale: {
		type: [String, Array] as PropType<Intl.LocalesArgument>,
		default: () => vergil.config.calendar.locale
	},
	labels: {
		type: Object as PropType<{
			months: TupleOf<string, 12>;
			shortMonths: TupleOf<string, 12>;
			shortWeekdays: TupleOf<string, 7>;
		}>,
		default: () => vergil.config.calendar.labels
	},
	firstWeekday: {
		type: Number as PropType<Weekday>,
		default: () => vergil.config.calendar.firstWeekday,
		validator: (n: number) => Number.isInteger(n) && n >= 0 && n < 7
	},
	min: {
		type: [String, Number, Date] as PropType<CalendarDate>,
		default: MIN_DATE,
		validator: isValidCalendarDate,
	},
	max: {
		type: [String, Number, Date] as PropType<CalendarDate>,
		default: MAX_DATE,
		validator: isValidCalendarDate,
	},
	selectedMonth: {
		type: String,
		validator(v) {
			const n = Number(v)
			return Number.isInteger(n) && n > 0 && n <= 12
		}
	},
	selectedYear: {
		type: String,
		validator(v) {
			const n = Number(v)
			return Number.isInteger(n) && n > 0 && n <= 9999
		}
	},
	time: {
		type: [Boolean, String],
		validator: (v: string) => typeof v === 'boolean' || reTime.test(v)
	},
	timeFormat: {
		type: String as PropType<'12' | '24'>,
		default: () => vergil.config.calendar.timeFormat,
		validator: (v: string) => ['24','12'].includes(v)
	},
	hours: {
		type: Object as PropType<TimeControls>,
		default: () => ({
			min: 0,
			max: 23,
			step: 1
		}),
		validator(h: TimeControls) {
			if (everyKeyInObject(h, { optional: ['min', 'max', 'step'] })) {
				const { min = 0, max = 23, step = 1 } = h
				return Number.isInteger(min) && Number.isInteger(max) && Number.isInteger(step)
					&& min >= 0 && min < max && max <= 23 && step > 0 && step <= max - min
			}
			return false
		} 
	},
	minutes: {
		type: Object as PropType<TimeControls>,
		default: () => ({
			min: 0,
			max: 59,
			step: 1
		}),
		validator(m: TimeControls) {
			if (everyKeyInObject(m, { optional: ['min', 'max', 'step'] })) {
				const { min = 0, max = 59, step = 1 } = m
				return Number.isInteger(min) && Number.isInteger(max) && Number.isInteger(step)
					&& min >= 0 && min < max && max <= 59 && step > 0 && step <= max - min
			}
			return false
		} 
	},
	disabledDates: Array as PropType<(CalendarDate | [CalendarDate, CalendarDate])[]>,
	enabledDates: Array as PropType<(CalendarDate | [CalendarDate, CalendarDate])[]>,
	disabledWeekdays: {
		type: Array as PropType<Weekday[]>,
		validator: (v: number[]) => v.length <= 7 && v.every(n => Number.isInteger(n) && n >= 0 && n < 7)
	},
	disabled: Boolean,

	//----- Debounced validation -----
	validationDelay: {
		type: Number,
		default: () => vergil.config.calendar.validationDelay ?? vergil.config.global.validationDelay,
	},
	validationCooldown: {
		type: Number,
		default: () => vergil.config.calendar.validationCooldown ?? vergil.config.global.validationCooldown,
	},

	//----- Theme -----
	descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.calendar.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.calendar.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.calendar.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.calendar.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})

const elements = useDefineElements(['root', 'dates'])

//-------------------- LOCALIZED LABELS --------------------
const labels = computed(() => {
	if (props.labels) {
		return props.labels
	} else {
		const labels = {
			months: [] as string[],
			shortMonths: [] as string[],
			shortWeekdays: [] as string[],
		}
		const auxDate = new Date()
		const weekdayFormatter = new Intl.DateTimeFormat(props.locale, { weekday: 'short' })
		const monthFormatter = new Intl.DateTimeFormat(props.locale, { month: 'long' })
		const shortMonthFormatter = new Intl.DateTimeFormat(props.locale, { month: 'short' })

		for (let i=0; i<7; i++) {
			labels.shortWeekdays[auxDate.getDay()] = ucFirst(weekdayFormatter.format(auxDate))
			auxDate.setDate(auxDate.getDate() + 1)
		}
		for (let i=0; i<12; i++) {
			const currentMonth = auxDate.getMonth()
			labels.months[currentMonth] = ucFirst(monthFormatter.format(auxDate))
			labels.shortMonths[currentMonth] = ucFirst(shortMonthFormatter.format(auxDate))
			auxDate.setMonth(currentMonth + 1, 1)
		}
		return labels as typeof props.labels
	}
})

//-------------------- MONTH/YEAR SELECTION --------------------
const selectionMode = shallowRef('date')
const displayedYear = shallowRef(0)
const displayedMonth = shallowRef(0)
const yearOffset = shallowRef(0)

const minDate = computed(() => normalizeCalendarDate(props.min) ?? MIN_DATE_COMPONENTS)
const maxDate = computed(() => normalizeCalendarDate(props.max) ?? MAX_DATE_COMPONENTS)
const pageFirstYear = computed(() => {
	const rem = displayedYear.value % 15
	return displayedYear.value - (rem === 0 ? 15 : rem) + 1 + (15 * yearOffset.value)
})

const monthsContainer = useTemplateRef('months')
const yearsContainer = useTemplateRef('years')

function toggleMonthSelection() {
	selectionMode.value = selectionMode.value === 'month' ? 'date' : 'month'
}
function toggleYearSelection() {
	if (selectionMode.value === 'year') {
		selectionMode.value = 'date'
	} else {
		yearOffset.value = 0
		selectionMode.value = 'year'
	}
}

function handleMonthSelection(event: MouseEvent) {
	const { target } = event as Omit<MouseEvent, 'target'> & { target: HTMLElement }
	if (target.tagName === 'BUTTON' && Object.hasOwn(target.dataset, 'month')) {
		displayedMonth.value = Number(target.dataset.month)
		selectionMode.value = 'date'
	}
}
function handleYearSelection(event: MouseEvent) {
	const { target } = event as Omit<PointerEvent, 'target'> & { target: HTMLElement }
	if (target.tagName === 'BUTTON' && Object.hasOwn(target.dataset, 'year')) {
		displayedYear.value = Number(target.dataset.year)
		selectionMode.value = 'date'
	}
}

function selectPrevMonth() {
	if (displayedMonth.value === 0) {
		displayedMonth.value = 11
		displayedYear.value--
	} else {
		displayedMonth.value--
	}
}
function selectNextMonth() {
	if (displayedMonth.value === 11) {
		displayedMonth.value = 0
		displayedYear.value++
	} else {
		displayedMonth.value++
	}
}

function handleArrowPrev() {
	if(selectionMode.value === 'date') {
		selectPrevMonth()
	} else if(selectionMode.value === 'year') {
		yearOffset.value--
	}
}
function handleArrowNext() {
	if(selectionMode.value === 'date') {
		selectNextMonth()
	} else if(selectionMode.value === 'year') {
		yearOffset.value++
	}
}

//-------------------- TIME SELECTION --------------------
const hours = useModel(0)
const minutes = useModel(0)
const displayedHours = useModel('00')
const displayedMinutes = useModel('00')
const timePeriod = shallowRef('AM')
const hoursMeta = computed(() => {
	const min = props.hours.min ?? 0
	const max = props.hours.max ?? 23
	const step = Math.min(props.hours.step ?? 1, max - min)
	return { min, max, step }
})
const minutesMeta = computed(() => {
	const min = props.minutes.min ?? 0
	const max = props.minutes.max ?? 59
	const step = Math.min(props.minutes.step ?? 1, max - min)
	return { min, max, step }
})

function updateHours(h: number | string, updateFormatted = true) {
	hours.value = clamp(Number(h), hoursMeta.value.min, hoursMeta.value.max)
	h = hours.value
	const hh = padLeadingZeros(hours.value)
	if (updateFormatted) {
		if (props.timeFormat === '24') {
			displayedHours.value = hh
		} else {
			if (h > 11) {
				h -= 12
				timePeriod.value = 'PM'
			} else {
				timePeriod.value = 'AM'
			}
			displayedHours.value = h === 0 ? '12' : padLeadingZeros(h)
		}
	}
	return hh
}
function updateMinutes(m: number | string, updateFormatted = true) {
	minutes.value = clamp(Number(m), minutesMeta.value.min, minutesMeta.value.max)
	const mm = padLeadingZeros(minutes.value)
	if (updateFormatted) {
		displayedMinutes.value = mm
	}
	return mm
}
function updateDateTime(lazyValidation = false) {
	function getNewModelValue(date: CalendarDate) {
		if (props.modelModifiers.string) {
			return (date as string).slice(0,10) + `T${padLeadingZeros(hours.value)}:${padLeadingZeros(minutes.value)}`
		} else if (props.modelModifiers.timestamp) {
			return new Date(date as number).setHours(hours.value, minutes.value)
		} else {
			(date as Date).setHours(hours.value, minutes.value)
			return date
		}
	}
	if (Array.isArray(model.value) && model.value.length > 0) {
		model.update(() => {
			for (let i=0; i<(model.value as CalendarDate[]).length; i++) {
				(model.value as CalendarDate[])[i] = getNewModelValue((model.value as CalendarDate[])[i] as CalendarDate)
			}
			model.triggerIfShallow()
			;(lazyValidation ? validateWithDelay : validateWithCooldown)(props.eagerValidation)
		})
	} else if (hasDate(model.value, false)) {
		model.update(() => {
			model.value = getNewModelValue(model.value as CalendarDate)
			triggerRef(model.ref)
			;(lazyValidation ? validateWithDelay : validateWithCooldown)(props.eagerValidation)
		})
	}
}

function handleBeforeInput(event: InputEvent) {
	if (event.data) {
		const prefix = (event.target as HTMLInputElement).value.slice(0, (event.target as HTMLInputElement).selectionStart as number)
		const suffix = (event.target as HTMLInputElement).value.slice((event.target as HTMLInputElement).selectionEnd as number)
		const newValue = prefix + event.data.slice(0, 2 - prefix.length - suffix.length) + suffix
		if (/\D/.test(newValue)) {
			event.preventDefault()
		}
	}
}

//-------------------- KEYBOARD NAVIGATION --------------------
function handleKeydown(event: KeyboardEvent) {
	const { key } = event
	if (isEscapeKey(event)) {
		if (selectionMode.value !== 'date') {
			selectionMode.value = 'date'
			yearOffset.value = 0
		}
	} else if (event.ctrlKey) {
		const displayedDate = [displayedYear.value, displayedMonth.value] as const
		if (selectionMode.value === 'date') {
			if (key === 'ArrowLeft' && compareDates(displayedDate, minDate.value) === 1) {
				selectPrevMonth()
			} else if (key === 'ArrowRight' && compareDates(displayedDate, maxDate.value) === -1) {
				selectNextMonth()
			} else if (key === 'ArrowDown' && displayedYear.value > minDate.value[0]) {
				displayedYear.value--
			} else if (key === 'ArrowUp' && displayedYear.value < maxDate.value[0]) {
				displayedYear.value++
			}
		} else if (selectionMode.value === 'year') {
			if (key === 'ArrowLeft' && pageFirstYear.value > minDate.value[0]) {
				yearOffset.value--
			} else if (key === 'ArrowRight' && (pageFirstYear.value + 14) < maxDate.value[0]) {
				yearOffset.value++
			}
		}
	} else if (isInput(event.target as HTMLElement, 'text') && Object.hasOwn((event.target as HTMLElement).dataset, 'timeControl')) {
		const control = (event.target as HTMLElement).dataset.timeControl
		if (key === 'ArrowUp') {
			if (control === 'hours') {
				updateHours(hours.value + hoursMeta.value.step)
			} else {
				updateMinutes(minutes.value + minutesMeta.value.step)
			}
			updateDateTime(true)
		} else if (key === 'ArrowDown') {
			if (control === 'hours') {
				updateHours(hours.value - hoursMeta.value.step)
			} else {
				updateMinutes(minutes.value - minutesMeta.value.step)
			}
			updateDateTime(true)
		}
	} else if (key.startsWith('Arrow') && !isInput(event.target as HTMLElement, 'range') ) {
		event.preventDefault()
		const { target } = event as Omit<KeyboardEvent, 'target'> & { target: HTMLElement }
		if (selectionMode.value === 'date') {
			if (isInput(target, 'checkbox')) {
				focusAdjacentSibling(elements.dates as HTMLElement, getDateIndex(normalizeCalendarDate(target.value)!), key.slice(5), 7, true)
			} else {
				focusFirstChild(elements.dates as HTMLElement, true)
			}
		} else if (selectionMode.value === 'month') {
			if (target.tagName === 'BUTTON' && Object.hasOwn(target.dataset, 'month')) {
				focusAdjacentSibling(monthsContainer.value as HTMLElement, Number(target.dataset.month), key.slice(5), 4)
			} else {
				focusFirstChild(monthsContainer.value as HTMLElement)
			}
		} else if (selectionMode.value === 'year') {
			if (target.tagName === 'BUTTON' && Object.hasOwn(target.dataset, 'year')) {
				focusAdjacentSibling(
					yearsContainer.value as HTMLElement,
					Number(target.dataset.year) - Number(((yearsContainer.value as HTMLElement).firstElementChild as HTMLElement).dataset.year),
					key.slice(5),
					5
				)
			} else {
				focusFirstChild(yearsContainer.value as HTMLElement)
			}
		}
	}
}

//-------------------- DISABLED/ENABLED DATES --------------------
const datesNormallyEnabled = computed(() => !!props.disabledDates || !props.enabledDates)
const enablementDates = computed(() => {
	return (props.disabledDates ?? props.enabledDates ?? []).map(d => {
		if (Array.isArray(d)) {
			d.length = 2
			for (let i=0; i<2; i++) {
				const date = normalizeCalendarDate(d[i] as CalendarDate)
				if (date === null) {
					// @ts-expect-error
					d = null
					break
				} else {
					// @ts-expect-error
					d[i] = date
				}
			}
			if (d !== null) {
				const r = compareDates(
					(d as unknown as [DateComponents, DateComponents])[0],
					(d as unknown as [DateComponents, DateComponents])[1]
				)
				if (r === 0) {
					// @ts-expect-error
					d = d[0]
				} else if (r === 1) {
					// @ts-expect-error
					[d[0],d[1]] = [d[1],d[0]]
				}
			}
		} else {
			// @ts-expect-error
			d = normalizeCalendarDate(d)
		}
		return d as unknown as null | DateComponents | [DateComponents, DateComponents]
	})
})

//-------------------- MODEL --------------------
const model = useDefineModel<CalendarModelDate>({ maybeObject: true })
const validateWithDelay = model.useDebouncedValidation(props.validationDelay)
const validateWithCooldown = model.useDebouncedValidation(props.validationCooldown, { eager: true })

model.onExternalUpdate(model.updateDecorator((modelValue, prevModelValue: CalendarModelDate | undefined) => {
	if (Array.isArray(modelValue)) {
		if (elements.dates) {
			updateDate(prevModelValue as CalendarModelDate)
			normalizeModelDates(model as ModelWrapper<CalendarDate[]>, props.modelModifiers, props.time, hours.value, minutes.value, date => {
				updateDate(date, true, true)
			})
		} else {
			let earliestDate: DateComponents | undefined
			normalizeModelDates(model as ModelWrapper<CalendarDate[]>, props.modelModifiers, props.time, hours.value, minutes.value, date => {
				if (!earliestDate || compareDates(date, earliestDate) === -1) {
					earliestDate = date
				}
			})
			if (earliestDate) {
				[displayedYear.value, displayedMonth.value] = earliestDate
			}
		}
	} else {
		const modelDate = normalizeCalendarDate(model.value as CalendarDate | null, true)
		const modelDateComponents = normalizeCalendarDate(modelDate)
		if (modelDateComponents !== null && isDateWithinRange(modelDateComponents, minDate.value, maxDate.value)) {
			if (elements.dates && updateDate(modelDateComponents, true, true)) {
				updateDate(prevModelValue as CalendarModelDate)
			} else {
				[displayedYear.value, displayedMonth.value] = modelDateComponents
			}

			let time = ''
			if (props.time) {
				modelDate.setSeconds(0,0)
				const hh = updateHours(modelDate.getHours())
				const mm = updateMinutes(modelDate.getMinutes())
				time = `T${hh}:${mm}`
			} else {
				modelDate.setHours(0,0,0,0)
			}

			if (props.modelModifiers.string) {
				model.value = formatCalendarDate(modelDateComponents) + time
			} else if (props.modelModifiers.timestamp) {
				model.value = modelDate.getTime()
			} else {
				model.value = modelDate
				triggerRef(model.ref)
			}
		} else {
			if (prevModelValue !== undefined) updateDate(prevModelValue as CalendarModelDate)
			if (props.modelModifiers.string) {
				model.value = ''
			} else if (props.modelModifiers.timestamp) {
				model.value = NaN
			} else {
				model.value = null
			}
		}
	}
}), { immediate: true })

const handleChange = model.updateDecorator((event: Event) => {
	const time = props.time ? `T${padLeadingZeros(hours.value)}:${padLeadingZeros(minutes.value)}` : ''
	const { target } = event as Omit<Event, 'target'> & { target: HTMLInputElement }
	if (Array.isArray(model.value)) {
		let newValue: CalendarDate, idx: number
		if (props.modelModifiers.string) {
			newValue = target.value + time
			idx = (model.value as string[]).indexOf(newValue)
		} else if (props.modelModifiers.timestamp) {
			newValue = Date.parse(target.value + (time || "T00:00"))
			idx = (model.value as number[]).indexOf(newValue)
		} else {
			newValue = new Date(target.value + (time || "T00:00"))
			const timestamp = newValue.getTime()
			idx = (model.value as Date[]).findIndex(date => timestamp === date.getTime())
		}
		if (idx > -1) {
			if (!target.checked) {
				model.value.splice(idx, 1)
				model.triggerIfShallow()
				model.handleValidation(props.eagerValidation)
			}
		} else if (target.checked) {
			model.value.push(newValue)
			model.triggerIfShallow()
			model.handleValidation(props.eagerValidation)
		}
	} else {
		if (target.checked) {
			updateDate(model.value)

			if (props.modelModifiers.string) {
				model.value = target.value + time
			} else if (props.modelModifiers.timestamp) {
				model.value = Date.parse(target.value + (time || "T00:00"))
			} else {
				model.value = new Date(target.value + (time || "T00:00"))
			}

			if (target.dataset.month === 'prev') {
				selectPrevMonth()
			} else if (target.dataset.month === 'next') {
				selectNextMonth()
			}
		} else {
			if (props.modelModifiers.string) {
				model.value = ''
			} else if (props.modelModifiers.timestamp) {
				model.value = NaN
			} else {
				model.value = null
			}
		}
		model.handleValidation(props.eagerValidation)
	}
})

//-------------------- GENERATE DATES --------------------
let calendarMeta: Pick<ReturnType<typeof getCalendarMeta>, 'firstDate' | 'lastDate'> & {
	prevMonthLastDate: number | undefined;
	currMonthLastDate: number;
}
function getDateIndex(date: DateComponents) {
	let idx = date[2] - calendarMeta.firstDate[2]
	const res = compareDates(date, [displayedYear.value, displayedMonth.value])
	if (calendarMeta.prevMonthLastDate && res > -1) {
		idx += calendarMeta.prevMonthLastDate
	}
	if (res === 1) {
		idx += calendarMeta.currMonthLastDate
	}
	return idx
}

function updateDate(
	date: MaybeArray<CalendarDate | DateComponents> | null,
	v: boolean | ((el: HTMLElement, date: DateComponents) => void) = false,
	isSingleDate?: boolean
) {
	function update(date: CalendarDate | DateComponents | null) {
		const normalizedDate = Array.isArray(date) ? date : normalizeCalendarDate(date)
		if (normalizedDate !== null && isDateWithinRange(normalizedDate, calendarMeta.firstDate, calendarMeta.lastDate)) {
			const idx = getDateIndex(normalizedDate)
			if (idx >= 0 && idx < (elements.dates as HTMLElement).childElementCount) {
				if (isFunction(v)) {
					v(elements.dates!.children.item(idx) as HTMLElement, normalizedDate)
				} else {
					(elements.dates!.children.item(idx)!.firstElementChild as HTMLInputElement).checked = v
				}
				return true
			}
		}
		return false
	}
	if (!isSingleDate && Array.isArray(date)) {
		date.forEach(update)
	} else {
		return update(date as CalendarDate | DateComponents | null)
	}
}

function* generateDates() {
	const { firstDate, lastDate, stages, totalDays } = getCalendarMeta(displayedYear.value, displayedMonth.value, props.firstWeekday)

	calendarMeta = {
		firstDate,
		lastDate,
		prevMonthLastDate: stages.prev?.lastDate,
		currMonthLastDate: stages.current.lastDate
	}

	const disabledDates = []
	if (!props.disabled) {
		disabledDates.length = totalDays

		for (const date of enablementDates.value) {
			if (date === null) continue
			if (date.length === 2) {
				if (compareDates(date[0], lastDate) < 1 && compareDates(date[1], firstDate) > -1) {
					const start = compareDates(date[0], firstDate) === 1 ? getDateIndex(date[0]) : 0
					const end = compareDates(date[1], lastDate) === -1 ? (getDateIndex(date[1]) + 1) : disabledDates.length
					for (let i=start; i<end; i++) {
						disabledDates[i] = true
					}
				}
			} else if (isDateWithinRange(date, firstDate, lastDate)) {
				disabledDates[getDateIndex(date)] = true
			}
		}
		if (isDateWithinRange(minDate.value, firstDate, lastDate)) {
			for (let i=(getDateIndex(minDate.value)-1); i>=0; i--) {
				disabledDates[i] = datesNormallyEnabled.value
			}
		}
		if (isDateWithinRange(maxDate.value, firstDate, lastDate)) {
			for (let i=(getDateIndex(maxDate.value)+1); i<disabledDates.length; i++) {
				disabledDates[i] = datesNormallyEnabled.value
			}
		}
		if (datesNormallyEnabled.value && props.disabledWeekdays) {
			for (const weekday of props.disabledWeekdays) {
				// @ts-expect-error
				let idx = weekday - props.firstWeekday + (weekday < props.firstWeekday && 7)
				do disabledDates[idx] = true
				while ((idx += 7) < disabledDates.length)
			}
		}
	}

	nextTick(() => {
		// DOM is not mounted during SSR
		if (elements.dates) {
			updateDate(model.value, true)
			updateDate('today', el => el.classList.add('calendar-today'))
		}
	})

	let idx = 0
	for (const stage of ['prev', 'current', 'next'] as const) {
		if (stages[stage] !== null) {
			const { date, firstDate, lastDate } = stages[stage]
			const datePrefix = `${padLeadingZeros(date[0], 4)}-${padLeadingZeros(date[1] + 1)}-`
			for (date[2] = firstDate; date[2] <= lastDate; date[2]++) {
				yield {
					value: datePrefix + padLeadingZeros(date[2]),
					disabled: props.disabled || (datesNormallyEnabled.value === Boolean(disabledDates[idx++])),
					'data-date': date[2],
					'data-month': stage
				}
			}
		}
	}
}

//---------- INITIALIZATION ----------
if (!hasDate(model.value)) {
	const today = normalizeCalendarDate('today')!

	if (props.selectedMonth || props.selectedYear) {
		const requestedDate = [
			props.selectedYear ? Number(props.selectedYear) : today[0],
			props.selectedMonth ? (Number(props.selectedMonth) - 1) : today[1]
		] as const

		if (compareDates(requestedDate, minDate.value, true) === -1) {
			[displayedYear.value, displayedMonth.value] = minDate.value
		} else if (compareDates(requestedDate, maxDate.value, true) === 1) {
			[displayedYear.value, displayedMonth.value] = maxDate.value
		} else {
			[displayedYear.value, displayedMonth.value] = requestedDate
		}
	} else {
		[displayedYear.value, displayedMonth.value] = isDateWithinRange(today, minDate.value, maxDate.value, true)
			? today
			: minDate.value
	}
}
if (props.time && (Array.isArray(model.value) || !hasDate(model.value, false))) {
	const [hh = '00', mm = '00'] = typeof props.time === 'string' ? props.time.split(':',2) : []
	updateHours(hh)
	updateMinutes(mm)
}

const themeClass = computed(() => {
	return model.hasErrors && !props.disabled
		? 'invalid' + (props.theme ? ' danger' : '')
		: props.theme && inferTheme(props.theme)
})
</script>

<template>
	<div :ref="elements.getRef('root')"
		:class="['calendar', themeClass, {
			[`size-${size}`]: size,
			[`radius-${radius}`]: radius,
			[`spacing-${spacing}`]: spacing,
		}]"
		@keydown="handleKeydown"
	>
		<div class="calendar-head">
			<button v-show="selectionMode !== 'month'" type="button" class="calendar-arrow calendar-button"
				:disabled="
					disabled
					|| (selectionMode === 'date' && displayedYear === minDate[0] && displayedMonth === minDate[1])
					|| (selectionMode === 'year' && (pageFirstYear - 1) < minDate[0])
				"
				@click="handleArrowPrev"
			>
				<Icon code="chevron_left"/>
			</button>
			<div>
				<button
					type="button"
					:class="['calendar-button', { pressed: selectionMode === 'month' }]"
					:disabled
					@click="toggleMonthSelection"
				>
					{{ labels.months[displayedMonth] }}
				</button>
				<button
					type="button"
					:class="['calendar-button', { pressed: selectionMode === 'year' }]"
					:disabled
					@click="toggleYearSelection"
				>
					{{ displayedYear }}
				</button>
			</div>
			<button v-show="selectionMode !== 'month'" type="button" class="calendar-arrow calendar-button"
				:disabled="
					disabled
					|| (selectionMode === 'date' && displayedYear === maxDate[0] && displayedMonth === maxDate[1])
					|| (selectionMode === 'year' && (pageFirstYear + 16) > maxDate[0])
				"
				@click="handleArrowNext"
			>
				<Icon code="chevron_right"/>
			</button>
		</div>
		<div v-show="selectionMode === 'date'" class="calendar-body">
			<div class="calendar-week">
				<p v-for="weekday of generateWeekdays(firstWeekday)" class="calendar-weekday">
					{{ labels.shortWeekdays[weekday] }}
				</p>
			</div>
			<div :ref="elements.getRef('dates')" class="calendar-dates" tabindex="0" @change="handleChange">
				<label v-for="date of generateDates()"
					:key="date.value"
					class="calendar-date calendar-button"
				>
					<input type="checkbox" v-bind="date" tabindex="-1"/>
					{{ date['data-date'] }}
				</label>
			</div>
		</div>
		<div v-if="selectionMode === 'month'" ref="months" class="calendar-months" @click="handleMonthSelection">
			<button v-for="m of generateIntegers(0,11)" :key="m"
				:class="['calendar-month calendar-button', {
					pressed: m === displayedMonth
				}]"
				:data-month="m"
				:disabled="!isDateWithinRange([displayedYear, m], minDate, maxDate, true)"
			>
				{{ labels.shortMonths[m] }}
			</button>
		</div>
		<div v-else-if="selectionMode === 'year'" ref="years" class="calendar-years" @click="handleYearSelection">
			<button v-for="y of generateYears(pageFirstYear)" :key="y"
				:class="['calendar-year calendar-button', {
					pressed: y === displayedYear
				}]"
				:disabled="y < minDate[0] || y > maxDate[0]"
				:data-year="y"
			>
				{{ y }}
			</button>
		</div>
		<div v-if="time && selectionMode === 'date'" class="calendar-foot">
			<div class="calendar-time">
				<InputText v-model="displayedHours" descendant data-time-control="hours"
					text-align="center"
					form="null"
					max="2"
					autoselect
					:disabled
					@beforeinput="handleBeforeInput"
					@input="(event: InputEvent) => {
						const newValue = Number((event.target as HTMLInputElement).value)
						updateHours(
							timeFormat === '24' ? newValue : (
								(newValue > 12 ? 11 : newValue === 12 ? 0 : newValue)
								+ (timePeriod === 'PM' ? 12 : 0)
							),
							false
						)
					}"
					@change="() => {
						displayedHours.value = timeFormat === '12' && hours.value === 0
							? '12' : padLeadingZeros(hours.value)
						updateDateTime()
					}"
				/>
				<p>:</p>
				<InputText v-model="displayedMinutes" descendant data-time-control="minutes"
					text-align="center"
					form="null"
					max="2"
					autoselect
					:disabled
					@beforeinput="handleBeforeInput"
					@input="updateMinutes(Math.min(59, Number($event.target.value)), false)"
					@change="() => {
						displayedMinutes.value = padLeadingZeros(minutes.value)
						updateDateTime()
					}"
				/>
				<Btn v-if="timeFormat === '12'"
					type="button"
					descendant
					:label="timePeriod"
					:disabled
					variant="soft" outline mask="ghost"
					@click="() => {
						if(timePeriod === 'AM') {
							timePeriod = 'PM'
							updateHours(hours.value + 12)
						} else {
							timePeriod = 'AM'
							updateHours(hours.value - 12)
						}
						updateDateTime()
					}"
				/>
			</div>
			<Slider v-model="hours" form="null" descendant min="0" max="23"
				:virtualMin="hoursMeta.min > 0 ? hoursMeta.min : undefined"
				:virtualMax="hoursMeta.max < 23 ? hoursMeta.max : undefined"
				:step="hoursMeta.step"
				:disabled
				@input="updateHours($event.target.value)"
				@change="updateDateTime()"
			/>
			<Slider v-model="minutes" form="null" descendant min="0" max="59"
				:virtualMin="minutesMeta.min > 0 ? minutesMeta.min : undefined"
				:virtualMax="minutesMeta.max < 59 ? minutesMeta.max : undefined"
				:step="minutesMeta.step"
				:disabled
				@input="updateMinutes($event.target.value)"
				@change="updateDateTime()"
			/>
		</div>
	</div>
</template>

<style>
.calendar {
	--date-size: 32;

	font-size: var(--font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-2xl);
    border-radius: var(--g-radius-lg);

	display: flex;
	flex-direction: column;
	border: 1px solid var(--c-grey-border-subtle);
	background-color: var(--c-bg);
    color: var(--c-text);

	&.invalid {
        box-shadow: inset 0 0 0 1px var(--c-theme-solid-1);
	}
	& :not(input[type="text"])::selection {
		background-color: transparent;
	}
	& .calendar-button {
		padding: 0;
		border: none;
		background-color: transparent;
		border-radius: var(--g-radius-full, var(--g-radius-md));

		&.calendar-today {
			background-color: var(--c-theme-soft-1);
			color: var(--c-theme-text-2);
		}
		&:focus-visible, &:has(> input:focus-visible){
			outline: 2px solid var(--c-theme-outline);
        	background-color: var(--c-grey-soft-1);
		}
		&:hover {
			background-color: var(--c-grey-soft-2);
		}
		&.pressed, &:has(> input:checked) {
			background-color: var(--c-theme-soft-2);
			color: var(--c-theme-text-2);
			font-weight: 500;
		}
		&:disabled, &:has(> input:disabled) {
			background-color: var(--c-disabled-1);
			color: var(--c-disabled-text);
			cursor: default;
		}
	}

	& > .calendar-head {
		font-size: 1.2em;
		display: grid;
		grid-template-columns: auto 1fr auto;
		margin: var(--g-gap-md) 0 var(--g-gap-3xl);

		& > .calendar-arrow {
			font-size: 1em;
			aspect-ratio: 1 / 1;
			display: flex;
			justify-content: center;
			align-items: center;

			& > .icon {
				font-size: calc(1.2em * var(--line-height-text));
				line-height: 1;
			}
		}
		& > div {
			grid-column-start: 2;
			justify-self: center;
			display: flex;
			column-gap: calc(2 * var(--gap-unit));

			& > button {
				font-size: 1em;
				font-weight: 600;
				padding: var(--g-gap-xs) var(--g-gap-sm);

				&.pressed {
					color: var(--c-text);
					font-weight: 600;
				}
			}
		}
	}
	& > .calendar-body {
		display: grid;
		grid-template-columns:repeat(7, calc(var(--date-size) * var(--gap-unit)));
		gap: var(--g-gap-lg) calc(2 * var(--gap-unit));

		& > .calendar-week {
			grid-column: span 7;
			display: grid;
			grid-template-columns: subgrid;

			& > .calendar-weekday {
				font-size: 0.9em;
				color: var(--c-grey-text-1);
				font-weight: 500;
				text-align: center;
				cursor: default;
			}
		}
		& > .calendar-dates {
			grid-column: span 7;
			display: grid;
			grid-template-columns: subgrid;
			row-gap: calc(2 * var(--gap-unit));
			border-radius: var(--g-radius-md);

			&:focus-visible {
				outline: 2px solid var(--c-theme-outline);
			}
			& > .calendar-date {
				font-size: 0.9em;
				display: flex;
				justify-content: center;
				align-items: center;
				aspect-ratio: 1 / 1;
				cursor: pointer;
				
				&:has(> input:not([data-month="current"])) {
					color: rgb(from var(--c-text) r g b / 0.5);
				}
				& > input {
					appearance: none;
					pointer-events: none;
					margin: 0;
					opacity: 0;
				}
			}
		}
	}
	& > .calendar-months {
		display: grid;
		grid-template-columns: repeat(4,1fr);
		gap: calc(2 * var(--gap-unit));

		& > .calendar-month {
			font-size: 1em;
			padding: var(--g-gap-md) var(--g-gap-2xl);
		}
	}
	& > .calendar-years {
		display: grid;
		grid-template-columns: repeat(5, calc(52 * var(--gap-unit)));
		gap: calc(2 * var(--gap-unit));

		& > .calendar-year {
			font-size: 1em;
			padding: var(--g-gap-md) 0;
		}
	}
	& > .calendar-foot {
		display: grid;
		grid-template-columns: auto minmax(0,1fr);
		gap: var(--g-gap-lg) var(--g-gap-2xl);
		margin-top: var(--g-gap-xl);
		padding-top: var(--g-gap-xl);
		border-top: 1px solid var(--c-grey-border-regular);
		font-weight: 500;

		& > .calendar-time {
			grid-row: span 2;
			display: flex;
			align-items: center;
			column-gap: var(--g-gap-sm);
			
			& > p {
				font-size: 1.4em;
				font-weight: 600;
			}
			& > .input-text {
				font-size: 1.2em;
				align-self: stretch;

				& > .input-text-outer {
					height: 100%;

					& > .input-text-wrapper {
						width: 2em;
						padding: 0;

						& > input {
							font-weight: 500;
						}
					}
				}
			}
			&:has(+ .slider > .slider-outer > .slider-wrapper > input:not(:disabled):hover) > .input-text:first-of-type > .input-text-outer > .input-text-wrapper,
			&:has(~ .slider:last-of-type > .slider-outer > .slider-wrapper > input:not(:disabled):hover) > .input-text:last-of-type > .input-text-outer > .input-text-wrapper {
				outline: 2px solid var(--c-theme-outline);
				background-color: var(--c-theme-soft-1);
    			transition: background-color 150ms, box-shadow 150ms, outline 50ms;
			}
			& > .btn {
				box-sizing: content-box;
				width: 2em;
				padding: var(--g-gap-xs);
			}
		}
		& > .slider  > .slider-outer {
			padding: 0;
			& > .slider-wrapper {
				--track-height: max(calc(3.5 * var(--gap-unit)), 2.5px);
				--knob-radius: max(calc(6 * var(--gap-unit)), 0px);
				& > input[type="range"] {
					flex-grow: 1;
					width: 0;
				}
			}
		}
	}
}

.calendar.size-xs > .calendar-body,
.size-xs .calendar > .calendar-body {
	--date-size: 42;
}
.calendar.size-xs.spacing-compact > .calendar-body,
.size-xs.spacing-compact .calendar > .calendar-body {
	--date-size: 68;
}
.calendar.size-sm.spacing-compact > .calendar-body,
.size-sm.spacing-compact .calendar > .calendar-body {
	--date-size: 54;
}
.calendar.size-md.spacing-compact > .calendar-body,
.size-md.spacing-compact .calendar > .calendar-body {
	--date-size: 50;
}
.calendar.size-lg.spacing-compact > .calendar-body,
.size-lg.spacing-compact .calendar > .calendar-body {
	--date-size: 45;
}
.calendar.size-xl.spacing-compact > .calendar-body,
.size-xl.spacing-compact .calendar > .calendar-body {
	--date-size: 42;
}
</style>