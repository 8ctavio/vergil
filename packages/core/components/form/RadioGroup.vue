<script setup>
import FormField from '../utils/FormField.vue'
import Radio from './Radio.vue'
import { provide, toRef } from 'vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities/private'

const props = defineProps({
    //----- Model -----
    value: {
        type: String,
        default: ''
    },
    modelValue: {
        default: props => useModel(props.value),
        validator: isModel
    },

    //----- Component specific -----
    options: Object,
    name: String,
    
    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,

    //----- Appearance -----
    theme: {
        type: String,
        default: () => vergil.config.radioGroup.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.radioGroup.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.radioGroup.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: () => vergil.config.radioGroup.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    disabled: Boolean,
})

const model = useModel(props.modelValue)

provide('radio-props', {
    groupModel: model,
    groupName: toRef(() => props.name),
    groupDisabled: toRef(() => props.disabled),
    groupTheme: toRef(() => props.theme)
})
</script>

<template>
    <FormField class="radio-group"
        :label :hint :description :help
        :size :radius :spacing
        >
        <div :class="['radio-group-wrapper', inferTheme(theme)]" :ref="model.getRef('el')">
            <slot>
                <Radio v-for="(label,value) in options" :key="value" :value :label/>
            </slot>
        </div>
    </FormField>
</template>

<style>
.radio-group-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: var(--g-gap-1);
}
</style>