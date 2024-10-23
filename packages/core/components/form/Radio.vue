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
    name: String,
    label: String,
    description: String,
    variant: {
        type: String,
        default: () => vergil.config.radio.variant,
        validator: v => isValidVariant('ToggleButton', v)
    },
    showSymbol: Boolean,
    radioRadius: {
        type: String,
        default: () => vergil.config.radio.radioRadius,
        validator: isValidRadius
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
    groupName,
    groupDisabled,
    groupTheme
} = inject('radio-props', {})

const model = useModel(props.modelValue ?? groupModel ?? useModel(''))

const theme = computed(() => props.theme ?? groupTheme?.value ?? vergil.config.radio.theme ?? vergil.config.global.theme)
const size = computed(() => props.size ?? (groupTheme ? '' : (vergil.config.radio.size ?? vergil.config.global.size)))
const radius = computed(() => props.radius ?? (groupTheme ? '' : (vergil.config.radio.radius ?? (props.variant === 'classic' ? 'full' : vergil.config.global.radius))))
const spacing = computed(() => props.spacing ?? (groupTheme ? '' : (vergil.config.radio.spacing ?? vergil.config.global.spacing)))

function handleTemplateRef(el) {
    if(!model.el) model.el = el
}
</script>

<template>
    <ToggleButton type="radio" :label :description
        :variant
        :showSymbol
        :radius="radioRadius"
        :class="[
            props.class,
            inferTheme(theme),
            {
                [`size-${size}`]: size,
                [`radius-${radius}`]: radius,
                [`spacing-${spacing}`]: spacing
            }
        ]">
        <template #input>
            <input
                v-bind="$attrs"
                v-model="model.value"
                :ref="handleTemplateRef"
                type="radio"
                :name="name || groupName"
                :disabled="disabled || groupDisabled"
                >
        </template>
        <template v-for="(_,name) in $slots" #[name]>
            <slot :name/>
        </template>
    </ToggleButton>
</template>