<script setup>
import ToggleButton from '../private/ToggleButton.vue'
import { computed, inject } from 'vue'
import { vergil } from '../../vergil'
import { useModel, isModel, watchControlled } from '../../composables'
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

const descendant = computed(() => props.descendant || isModel(groupModel))
const theme = computed(() => props.theme ?? (descendant.value ? undefined : (vergil.config.radio.theme ?? vergil.config.global.theme)))
const size = computed(() => props.size ?? (descendant.value ? undefined : (vergil.config.radio.size ?? vergil.config.global.size)))
const radius = computed(() => props.radius ?? (descendant.value ? undefined : (vergil.config.radio.radius ?? vergil.config.global.radius)))
const spacing = computed(() => props.spacing ?? (descendant.value ? undefined : (vergil.config.radio.spacing ?? vergil.config.global.spacing)))

let radio = null
function handleTemplateRef(el) {
    radio = el
    if(!model.el) model.el = el
}

const model = useModel(props.modelValue ?? groupModel ?? useModel(''))
const modelWatcher = watchControlled(model.ref, modelValue => {
    if(radio) {
        radio.checked = modelValue === radio.value
    }
})
function handleChange(event) {
    modelWatcher.pause()
    model.watchers.pause()
    if(event.target.checked) model.value = event.target.value
    model.watchers.resume()
    modelWatcher.resume()
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
                :ref="handleTemplateRef"
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