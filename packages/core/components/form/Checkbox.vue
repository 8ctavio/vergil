<script setup>
import ToggleButton from '../private/ToggleButton.vue'
import { computed, inject } from 'vue'
import { vergil } from '../../vergil'
import { useDefineModel, useDefineElements } from '../../composables'
import { isObject } from '../../utilities'
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
        default: props => {
            const groupProps = inject('checkbox-group-props', {
                model: props.valueUnchecked
            })
            return groupProps.model
        }
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
const groupProps = inject('checkbox-group-props', null)

const descendant = computed(() => props.descendant || isObject(groupProps))
const theme = computed(() => props.theme ?? (descendant.value ? undefined : (vergil.config.checkbox.theme ?? vergil.config.global.theme)))
const size = computed(() => props.size ?? (descendant.value ? undefined : (vergil.config.checkbox.size ?? vergil.config.global.size)))
const radius = computed(() => props.radius ?? (descendant.value ? undefined : (vergil.config.checkbox.radius ?? vergil.config.global.radius)))
const spacing = computed(() => props.spacing ?? (descendant.value ? undefined : (vergil.config.checkbox.spacing ?? vergil.config.global.spacing)))

const model = useDefineModel({ isCollection: true })
if(props.checked) {
    if(Array.isArray(model.value)) {
        if(!model.value.includes(props.valueChecked)) {
            model.value.push(props.valueChecked)
            model.triggerIfShallow()
        }
    } else if(model.value === props.valueUnchecked) {
        model.value = props.valueChecked
    }
}

const elements = useDefineElements(['input'])
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
                model.triggerIfShallow()
            }
        } else if(event.target.checked) {
            model.value.push(props.valueChecked)
            model.triggerIfShallow()
        }
    } else {
        model.value = event.target.checked ? props.valueChecked : props.valueUnchecked
    }
})
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
                ref="input"
                :value="valueChecked"
                :disabled="disabled || groupProps?.disabled.value"
                @change="handleChange"
            >
        </template>
        <template v-for="(_,name) in $slots" #[name]>
            <slot :name/>   
        </template>
    </ToggleButton>
</template>