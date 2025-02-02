<script setup>
import ToggleButton from '../private/ToggleButton.vue'
import { computed, useTemplateRef, inject } from 'vue'
import { vergil } from '../../vergil'
import { useDefineModel, useDefineElements, isInstanceModel } from '../../composables'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
const props = defineProps({
	//----- Model -----
    modelValue: [String, Object],
    ['onUpdate:modelValue']: Function,
    elements: Object,
    exposed: Object,

    checked: Boolean,
    value: {
        type: String,
        default: 'on'
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
    disabled: Boolean,
    class: [String, Object],

    descendant: Boolean,
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
    }
})
const {
    groupModel,
    groupName,
    groupDisabled,
} = inject('radio-props', {})

const descendant = computed(() => props.descendant || isInstanceModel(groupModel))
const theme = computed(() => props.theme ?? (descendant.value ? undefined : (vergil.config.radio.theme ?? vergil.config.global.theme)))
const size = computed(() => props.size ?? (descendant.value ? undefined : (vergil.config.radio.size ?? vergil.config.global.size)))
const radius = computed(() => props.radius ?? (descendant.value ? undefined : (vergil.config.radio.radius ?? vergil.config.global.radius)))
const spacing = computed(() => props.spacing ?? (descendant.value ? undefined : (vergil.config.radio.spacing ?? vergil.config.global.spacing)))

const model = useDefineModel(typeof props.modelValue === 'undefined'
    ? isInstanceModel(groupModel)
        ? { modelValue: groupModel }
        : { modelValue: '' }
    : props
)
const elements = useDefineElements(props, {
    input: useTemplateRef('radio')
})
model.onExternalUpdate(modelValue => {
    elements.input.checked = modelValue === elements.input.value
}, { onMounted: true })
function handleChange(event) {
    if(event.target.checked) {
        model.update(event.target.value)
    }
}

if(props.checked && model.value === '') {
    model.value = props.value
}
</script>

<template>
    <ToggleButton type="radio" :label :description
        :variant
        :showSymbol
        :radius="radioRadius"
        :class="[props.class, {
            [inferTheme(theme)]: theme,
            [`size-${size}`]: size,
            [`radius-${radius}`]: radius,
            [`spacing-${spacing}`]: spacing
        }]">
        <template #input>
            <input
                v-bind="$attrs"
                type="radio"
                ref="radio"
                :value
                :name="name || groupName"
                :disabled="disabled || groupDisabled"
                @change="handleChange"
            >
        </template>
        <template v-for="(_,name) in $slots" #[name]>
            <slot :name/>
        </template>
    </ToggleButton>
</template>