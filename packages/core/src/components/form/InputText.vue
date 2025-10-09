<script setup lang="ts">
import { computed, provide } from 'vue'
import { vergil } from '#vergil'
import { InputTextBase } from '#components'
import { useDefineModel, useDefineElements } from '#composables'
import { spaceEvenly } from '#utilities'
import type { PropType } from 'vue'
import type { ModelValueProp, ModelValidatorProp } from '#composables'
import type { Elements } from '#reactivity'

const props = defineProps({
	//----- Model -----
    value: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Object] as ModelValueProp<string>,
        default: (props: { value: string }) => props.value
    },
    ['onUpdate:modelValue']: Function,
    validator: Function as ModelValidatorProp<string>,
    eagerValidation: Boolean,
    elements: Object as PropType<Elements>,

    spaceEvenly: Boolean,

	//----- Debounced validation -----
    preventEnterValidation: Boolean,
	validationDelay: {
		type: Number,
		default: () => vergil.config.inputText.validationDelay ?? vergil.config.global.validationDelay,
	},
	validationCooldown: {
		type: Number,
		default: () => vergil.config.inputText.validationCooldown ?? vergil.config.global.validationCooldown,
	},
})

const model = useDefineModel<string>()
const elements = useDefineElements(['input'])
provide('model', model)
provide('elements', elements)

const validateInput = model.useDebouncedValidation(props.validationDelay)
const validateEnter = model.useDebouncedValidation(props.validationCooldown, { eager: true })

model.onExternalUpdate(modelValue => {
    (elements.input as HTMLInputElement).value = modelValue
}, { onMounted: true })

const handleInput = model.updateDecorator((event: InputEvent) => {
    model.value = (event.target as HTMLInputElement).value
    validateInput(props.eagerValidation)
})

let oldValue: string | undefined
function handleEnter(event: KeyboardEvent) {
    if (props.spaceEvenly && (event.target as HTMLInputElement).value !== oldValue) {
        evenlySpaceInputValue(event.target as HTMLInputElement)
        oldValue = (event.target as HTMLInputElement).value
    }
	if (!((event.target as HTMLInputElement).form || props.preventEnterValidation)) {
		validateEnter(props.eagerValidation)
	}
}
function onFocus(event: FocusEvent) {
    oldValue = (event.target as HTMLInputElement).value
}
function onBlur(event: FocusEvent) {
    if ((event.target as HTMLInputElement).value !== oldValue) {
        evenlySpaceInputValue(event.target as HTMLInputElement)
    }
    oldValue = undefined
}
function evenlySpaceInputValue(input: HTMLInputElement) {
    if (input === document.activeElement) {
        const str = input.value.trimStart()
        const leadingWhitespaceCount = input.value.length - str.length
        const adjustedSelectionStart = (input.selectionStart as number) - leadingWhitespaceCount
        let cursorStart = adjustedSelectionStart
        if (input.selectionStart === input.selectionEnd) {
            model.update(input.value = spaceEvenly(str, (match: string, offset: number) => {
                if (offset < adjustedSelectionStart) {
                    cursorStart -= Math.min(adjustedSelectionStart, offset + match.length - 1) - offset
                }
                return " "
            }))
            input.setSelectionRange(cursorStart, cursorStart)
        } else if ((input.selectionEnd as number) > (input.selectionStart as number)) {
            const adjustedSelectionEnd = (input.selectionEnd as number) - leadingWhitespaceCount
            let cursorEnd = adjustedSelectionEnd
            model.update(input.value = spaceEvenly(str, (match, offset) => {
                if(offset < adjustedSelectionEnd) {
                    const matchLastIndex = offset + match.length - 1
                    cursorEnd -= Math.min(adjustedSelectionEnd, matchLastIndex) - offset
                    if(offset < adjustedSelectionStart) {
                        cursorStart -= Math.min(adjustedSelectionStart, matchLastIndex) - offset
                    }
                }
                return " "
            }))
            input.setSelectionRange(cursorStart, cursorEnd)
        }
    } else {
        model.update(input.value = spaceEvenly(input.value))
    }
}

const spaceEvenlyHandlers = computed(() => {
    return props.spaceEvenly ? { onFocus, onBlur } : null
})
</script>

<template>
    <InputTextBase
        @input="handleInput"
        @keydown.passive.enter="handleEnter"
        v-bind="spaceEvenlyHandlers"
    />
</template>