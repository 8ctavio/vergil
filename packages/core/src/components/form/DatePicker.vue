<script lang="ts">
import { hasDate, isDate, padLeadingZeros } from '#utilities'
import type { SetupContext } from 'vue'

function DatePickerWrapper(props: { sideButtonPosition: 'before' | 'after' }, { slots }: SetupContext) {
	const position = props.sideButtonPosition ?? vergil.config.datePicker.sideButtonPosition
	const vnodes = slots.default!({ iconProp: position === 'before' ? 'iconRight' : 'icon' })
	return h('div', { class: 'date-picker-wrapper' }, position === 'before'
		? vnodes.reverse()
		: vnodes
	)
}
</script>

<script setup lang="ts">
import { computed, shallowRef, useTemplateRef, watch, watchEffect, getCurrentScope, onMounted, useAttrs, h } from 'vue'
import { vergil } from '#vergil'
import { Calendar, Btn, FormField, MiniMarkup } from '#components'
import { useDefineModel, usePopover } from '#composables'
import { isFunction, isObject, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '#utilities'
import type { PropType } from 'vue'
import type { ModelValueProp, ModelValidatorProp, Elements } from '#composables'
import type { CalendarModelDate, Theme, Size, Radius, Spacing } from '#utilities'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
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

	//----- Calendar -----
	locale: {
		type: [String, Array] as PropType<Intl.LocalesArgument>,
		default: () => vergil.config.calendar.locale,
	},

	format: [Object, Function] as PropType<Intl.DateTimeFormatOptions | ((date: Date) => string)>,
	placeholder: String,
    placeholderFallback: {
        type: Function as PropType<(n: number) => string>,
        default: (n: number) => vergil.config.datePicker.placeholderFallback(n)
    },
	iconCalendar: {
        type: String,
        default: 'calendar_month'
    },
    iconClear: {
        type: String,
        default: 'event_busy'
    },
    btnClear: Object,
	underline: {
        type: Boolean,
        default: () => vergil.config.datePicker.underline,
    },
    fill: {
        type: Boolean,
        default: () => vergil.config.datePicker.fill,
    },
    disabled: Boolean,
    class: [String, Object],

	//----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,
	showErrors: Boolean,
    floatLabel: Boolean,
    
    //----- Global -----
    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.datePicker.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.datePicker.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.datePicker.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.datePicker.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    },
})

const model = useDefineModel<CalendarModelDate, false, false, true, true>({
	isCollection: true,
	includeElements: true,
	captureElements: true
})
const isSelected = computed(() => hasDate(model.value))
const floatLabelEnabled = computed(() => {
	return props.floatLabel
		&& Boolean(props.label)
		&& !(props.placeholder || props.description)
})

//---------- POPOVER ----------
const {
	Popover,
	closePopover,
	togglePopover,
} = usePopover({
	placement: 'bottom',
	offset: 4,
	closeBehavior: 'hide'
})

const setupScope = getCurrentScope()!
onMounted(() => {
    setupScope.run(() => {
        watchEffect(() => {
            if(props.disabled) closePopover()
        })
    })
})

//---------- UPDATE BTN LABEL ----------
const virtualPlaceholder = useTemplateRef('virtual-placeholder')
const computedPlaceholder = shallowRef(floatLabelEnabled.value ? '' : props.placeholder)
const timeEnabled = computed(() => Object.hasOwn(attrs, 'time'))
const format = computed(() => {
	if (isFunction(props.format)) {
		return props.format
	} else if (isObject(props.format)) {
		return new Intl.DateTimeFormat(props.locale, props.format).format
	} else if (isFunction(vergil.config.datePicker.format)) {
		return vergil.config.datePicker.format
	} else if (isFunction(vergil.config.datePicker.formatOptions)) {
		return new Intl.DateTimeFormat(
			props.locale,
			vergil.config.datePicker.formatOptions(timeEnabled.value)
		).format
	} else if (isObject(vergil.config.datePicker.formatOptions)) {
		return new Intl.DateTimeFormat(
			props.locale,
			vergil.config.datePicker.formatOptions
		).format
	} else {
		return (date: Date) => {
			let str = padLeadingZeros(date.getFullYear(), 4)
				+ '-' + padLeadingZeros(date.getMonth() + 1)
				+ '-' + padLeadingZeros(date.getDate())
			if (timeEnabled.value) {
				str += `T${padLeadingZeros(date.getHours())}:${padLeadingZeros(date.getMinutes())}`
			}
			return str
		} 
	}
})
function formatDate(date: unknown) {
	if (typeof date === 'string') {
		if (date[10] !== 'T') date += "T00:00"
		date = new Date(date)
	} else if (typeof date === 'number') {
		date = new Date(date)
	}
	return isDate(date) ? format.value(date) : ''
}
watch(model.ref, (modelValue, prevModelValue) => {
	if (Array.isArray(modelValue)) {
		let placeholder = ''
		modelValue.forEach(date => {
			if (hasDate(date, false)) {
				placeholder += (placeholder.length > 0 ? ', ' : '') + formatDate(date)
			}
		})
		if (placeholder) {
			virtualPlaceholder.value!.innerText = placeholder
			const n = (model.value as unknown[]).length
			const updatePlaceholder = () => {
				computedPlaceholder.value = virtualPlaceholder.value!.offsetWidth < virtualPlaceholder.value!.scrollWidth
					? props.placeholderFallback(n)
					: placeholder
				virtualPlaceholder.value!.innerText = ''
			}
			if (floatLabelEnabled.value && !hasDate(prevModelValue)) {
				setTimeout(updatePlaceholder, 75)
			} else {
				updatePlaceholder()
			}
		} else {
			computedPlaceholder.value = floatLabelEnabled.value ? '' : props.placeholder
		}
	} else {
		if (hasDate(modelValue, false)) {
			const updatePlaceholder = () => {
				computedPlaceholder.value = formatDate(modelValue)
			}
			if (floatLabelEnabled.value && !hasDate(prevModelValue)) {
				setTimeout(updatePlaceholder, 75)
			} else {
				updatePlaceholder()
			}
		} else {
			computedPlaceholder.value = floatLabelEnabled.value ? '' : props.placeholder
		}
	}
}, { deep: 1 })

//-------------------- KEYBOARD NAVIGATION --------------------
function handleKeydown(event: KeyboardEvent) {
	if (['Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
		if(event.key[0] === 'A' && !event.shiftKey) {
			event.preventDefault()
		}
		model.elements.root!.dispatchEvent(new KeyboardEvent('keydown', {
			key: event.key,
			ctrlKey: event.ctrlKey,
			shiftKey: event.shiftKey,
			altKey: event.altKey,
			metaKey: event.metaKey
		}))
	}
}
</script>

<template>
	<FormField :class="['date-picker', props.class]"
		:label :hint :description :help :float-label="floatLabelEnabled"
		:theme :size :radius :spacing
		:showErrors :errors="model.errors"
	>
		<Popover :class="['date-picker-popover', props.class]"
			:theme="model.error ? 'danger' : theme" :size :radius :spacing
		>
			<DatePickerWrapper :sideButtonPosition="btnClear?.position" v-slot="{ iconProp }"
				@keydown="handleKeydown"
			>
				<Btn
					:class="['date-picker-select', {
						selected: isSelected,
						invalid: model.error
					}]"
					descendant
					type="button"
					mask="form-field"
					outline="subtle"
					:fill
					:underline
					:squared="false"
					:disabled
					@click="togglePopover"
				>
					<p class="date-picker-placeholder">
						<span ref="virtual-placeholder"/>
						{{ computedPlaceholder ?? '&ZeroWidthSpace;' }}
					</p>
					<template #aside>
						<label v-if="floatLabelEnabled">
							<MiniMarkup :str="label"/>
						</label>
					</template>
				</Btn>
				<Btn
					v-bind="btnClear"
					type="button"
					class="date-picker-clear"
					descendant
					:variant="btnClear?.variant ?? 'subtle'"
					:outline="btnClear?.outline ?? 'subtle'"
					:[iconProp]="isSelected ? iconClear : iconCalendar"
					:disabled="btnClear?.disabled || disabled"
					@click="() => {
						if(isSelected) {
							if(Array.isArray(model.value)) {
								model.value = []
							} else {
								if(modelModifiers.string) {
									model.value = ''
								} else if(modelModifiers.timestamp) {
									model.value = NaN
								} else {
									model.value = null
								}
							}
							model.handleValidation(props.eagerValidation)
						} else {
							togglePopover()
						}
					}"
				/>
			</DatePickerWrapper>
			<template #portal>
				<Calendar
					v-bind="$attrs"
					descendant
					:model-value="model"
					:modelModifiers
					:eagerValidation
					:locale
				/>
			</template>
		</Popover>
	</FormField>
</template>

<style>
.date-picker > .date-picker-wrapper {
	display: flex;
	width: 100%;

	&:has(> .date-picker-clear:first-child) > .date-picker-select {
		margin-left: calc(var(--btn-bw) * -1);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    &:has(> .date-picker-clear:last-child) > .date-picker-select {
		margin-right: calc(var(--btn-bw) * -1);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
	& > .date-picker-clear {
		flex-shrink: 0;
		&:first-child {
			z-index: 1;
			border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        &:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
	}
	& > .date-picker-select {
		flex-grow: 1;

		&.selected {
			--btn-c-text-1: var(--c-text);
			& > label {
				font-size: 0.9em;
				font-weight: 450;
				padding: 0;
				color: var(--c-text);
				transform: translateY(-100%);
				padding-bottom: var(--g-gap-sm);
				transition: transform 150ms, padding 150ms 50ms, font-size 150ms;
			}
		}
		& > .btn-content {
			justify-content: stretch;

			& > .date-picker-placeholder {
				position: relative;
				text-align: left;
				overflow-x: hidden;
				text-wrap: nowrap;
				text-overflow: ellipsis;
				&::selection {
					background-color: transparent;
				}
				& > span {
					position: absolute;
					inset: 0;
					visibility: hidden;
				}
			}
		}
		& > label {
			position: absolute;
			top: 0;
			left: 0;
			padding: var(--g-gap-md) var(--g-gap-2xl);
			pointer-events: none;
			user-select: none;
			transform: translateY(0);
			transition: transform 150ms 50ms, padding 150ms, font-size 150ms 50ms;
		}
	}
}

#popover-portal > .popover-wrapper > .date-picker-popover > .calendar {
    --calendar-bw: 0px;
	box-shadow: 2px 2px 3px var(--c-box-shadow),
				inset 0 0 0 var(--calendar-bw) var(--c-theme-solid-1);
	&.invalid {
		--calendar-bw: 1px;
	}
}
</style>