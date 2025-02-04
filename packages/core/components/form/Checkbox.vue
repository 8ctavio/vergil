<script setup>
import ToggleButton from '../private/ToggleButton.vue'
import { computed, useTemplateRef, inject } from 'vue'
import { vergil } from '../../vergil'
import { useDefineModel, useDefineElements, isInstanceModel } from '../../composables'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
const props = defineProps({
	//----- Model -----
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
    modelValue: {
        type: [Object, String, Boolean],
        default: undefined
    },
    ['onUpdate:modelValue']: Function,
    elements: Object,
    exposed: Object,

    label: String,
    description: String,
    variant: {
        type: String,
        default: () => vergil.config.checkbox.variant,
        validator: v => isValidVariant('ToggleButton', v)
    },
    showSymbol: Boolean,
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
    groupDisabled,
} = inject('checkbox-props', {})

const descendant = computed(() => props.descendant || isInstanceModel(groupModel))
const theme = computed(() => props.theme ?? (descendant.value ? undefined : (vergil.config.checkbox.theme ?? vergil.config.global.theme)))
const size = computed(() => props.size ?? (descendant.value ? undefined : (vergil.config.checkbox.size ?? vergil.config.global.size)))
const radius = computed(() => props.radius ?? (descendant.value ? undefined : (vergil.config.checkbox.radius ?? vergil.config.global.radius)))
const spacing = computed(() => props.spacing ?? (descendant.value ? undefined : (vergil.config.checkbox.spacing ?? vergil.config.global.spacing)))

const model = useDefineModel(typeof props.modelValue === 'undefined'
    ? isInstanceModel(groupModel)
        ? { modelValue: groupModel }
        : { modelValue: props.valueUnchecked }
    : props,
    { isCollection: true }
)
const elements = useDefineElements({
    input: useTemplateRef('checkbox')
})
model.onExternalUpdate(modelValue => {
    elements.input.checked = Array.isArray(modelValue)
        ? modelValue.includes(props.valueChecked)
        : modelValue === props.valueChecked
}, { onMounted: true })
const handleChange = model.updateDecorator(event => {
    if(Array.isArray(model.value)) {
        const idx = model.value.indexOf(props.valueChecked)
        if(idx > -1) {
            if(!event.target.checked) {
                model.value.splice(idx, 1)
            }
        } else if(event.target.checked) {
            model.value.push(props.valueChecked)
        }
    } else {
        model.value = event.target.checked ? props.valueChecked : props.valueUnchecked
    }
})

if(props.checked) {
    if(Array.isArray(model.value)) {
        if(!model.value.includes(props.valueChecked)) {
            model.value.push(props.valueChecked)
        }
    } else if(model.value === props.valueUnchecked) {
        model.value = props.valueChecked
    }
}
</script>

<template>
    <ToggleButton type="checkbox" :label :description
        :variant
        :showSymbol
        :class="[props.class, {
            [inferTheme(theme)]: theme,
            [`size-${size}`]: size,
            [`radius-${radius}`]: radius,
            [`spacing-${spacing}`]: spacing
        }]">
        <template #input>
            <input
                v-bind="$attrs"
                type="checkbox"
                ref="checkbox"
                :value="valueChecked"
                :disabled="disabled || groupDisabled"
                @change="handleChange"
            >
        </template>
        <template v-for="(_,name) in $slots" #[name]>
            <slot :name/>   
        </template>
    </ToggleButton>
</template>