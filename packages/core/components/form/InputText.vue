<script setup>
import InputTextBase from '../private/InputTextBase.vue'
import { computed, provide } from 'vue'
import { vergil } from '../../vergil'
import { useDefineModel, useDefineElements } from '../../composables'
import { spaceEvenly } from '../../utilities'

const props = defineProps({
	//----- Model -----
    value: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Object],
        default: props => props.value
    },
    ['onUpdate:modelValue']: Function,
    validator: Function,
    eagerValidation: Boolean,
    elements: Object,

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

const model = useDefineModel()
const elements = useDefineElements(['input'])
provide('model', model)
provide('elements', elements)

const validateInput = model.useDebouncedValidation(props.validationDelay)
const validateEnter = model.useDebouncedValidation(props.validationCooldown, { eager: true })

model.onExternalUpdate(modelValue => {
    elements.input.value = modelValue
}, { onMounted: true })

const handleInput = model.updateDecorator(event => {
    model.value = event.target.value
    validateInput(props.eagerValidation)
})

let oldValue
function handleEnter(event) {
    if(props.spaceEvenly && event.target.value !== oldValue) {
        evenlySpaceInputValue(event.target)
        oldValue = event.target.value
    }
	if (!(event.target.form || props.preventEnterValidation)) {
		validateEnter(props.eagerValidation)
	}
}
function onFocus(event) {
    oldValue = event.target.value
}
function onBlur(event) {
    if(event.target.value !== oldValue) {
        evenlySpaceInputValue(event.target)
    }
    oldValue = undefined
}
function evenlySpaceInputValue(input) {
    if(input === document.activeElement) {
        const str = input.value.trimStart()
        const leadingWhitespaceCount = input.value.length - str.length
        const adjustedSelectionStart = input.selectionStart - leadingWhitespaceCount
        let cursorStart = adjustedSelectionStart
        if(input.selectionStart === input.selectionEnd) {
            model.update(input.value = spaceEvenly(str, (match, offset) => {
                if(offset < adjustedSelectionStart) {
                    cursorStart -= Math.min(adjustedSelectionStart, offset + match.length - 1) - offset
                }
                return " "
            }))
            input.setSelectionRange(cursorStart, cursorStart)
        } else if(input.selectionEnd > input.selectionStart) {
            const adjustedSelectionEnd = input.selectionEnd - leadingWhitespaceCount
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