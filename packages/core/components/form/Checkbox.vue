<script setup>
import ToggleButton from '../private/ToggleButton.vue'
import { computed, inject } from 'vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
defineEmits(['update:modelValue'])

const props = defineProps({
    modelValue: {
        validator: isModel
    },
    checked: Boolean,
    value: {
        type: [String, Boolean],
        default: undefined
    },
    valueChecked: {
        type: [String, Boolean],
        default: props => props.value ?? true
    },
    valueUnchecked: {
        type: [String, Boolean],
        default: props => (typeof props.valueChecked === 'string') ? '' : false
    },
    label: String,
    description: String,
    variant: {
        type: String,
        default: () => vergil.config.checkbox.variant,
        validator: v => isValidVariant('ToggleButton', v)
    },
    theme: {
        type: String,
        validator: isValidTheme
    },
    size: {
        type: String,
        validator: isValidSize
    },
    radius: {
        type: String,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        validator: isValidSpacing
    },
    disabled: Boolean,
    class: [String, Object]
})
const {
    groupModel,
    groupDisabled,
    groupTheme
} = inject('checkbox-props', {})

const model = useModel(props.modelValue ?? groupModel ?? useModel(props.checked ? props.valueChecked : props.valueUnchecked))

const theme = computed(() => props.theme ?? groupTheme?.value ?? vergil.config.checkbox.theme ?? vergil.config.global.theme)
const size = computed(() => props.size ?? (groupTheme ? '' : (vergil.config.checkbox.size ?? vergil.config.global.size)))
const radius = computed(() => props.radius ?? (groupTheme ? '' : (vergil.config.checkbox.radius ?? vergil.config.global.radius)))
const spacing = computed(() => props.spacing ?? (groupTheme ? '' : (vergil.config.checkbox.spacing ?? vergil.config.global.spacing)))
</script>

<template>
    <ToggleButton type="checkbox" :label :description :variant
        :class="[
            inferTheme(theme),
            `size-${size}`,
            `radius-${radius}`,
            `spacing-${spacing}`,
            props.class,
        ]">
        <template #input>
            <input
                v-bind="$attrs"
                v-model="model.value"
                :value="valueChecked"
                :true-value="valueChecked"
                :false-value="valueUnchecked"
                :ref="model.refs.el"
                type="checkbox"
                :disabled="disabled || groupDisabled"
                >
        </template>
        <template v-for="(_,name) in $slots" #[name]>
            <slot :name/>   
        </template>
    </ToggleButton>
</template>