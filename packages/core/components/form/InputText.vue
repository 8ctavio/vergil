<script setup>
import InputTextBase from '../private/InputTextBase.vue'
import { isRef, provide, onMounted } from 'vue'
import { useDefineModel, useDefineElements } from '../../composables'

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
    elements: Object,
})

const model = useDefineModel()
const elements = useDefineElements(['input'])

provide('model', model)
provide('elements', elements)

model.onExternalUpdate(modelValue => {
    elements.input.value = modelValue
}, { onMounted: true })

const validateInput = model.useDebouncedValidate(300)
const handleInput = model.updateDecorator(event => {
    model.value = event.target.value
    if(model.error) {
        validateInput()
    }
})
if(isRef(model.errors)) {
    const validateEnter = model.useDebouncedValidate(350, { eager: true })
    onMounted(() => {
        elements.input.addEventListener('keydown', event => {
            if(event.key === 'Enter' && model.error) {
                validateEnter()
            }
        }, { passive: true })
    })
}
</script>

<template>
    <InputTextBase @input="handleInput"/>
</template>