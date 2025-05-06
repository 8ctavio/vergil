<script setup lang="ts">
import ToggleButton from '../internal/ToggleButton.vue'
import { toRef, computed, inject } from 'vue'
import { vergil } from '../../vergil'
import { useDefineModel, useDefineElements } from '../../composables'
import { isObject, inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../../utilities'
import type { PropType } from 'vue'
import type { ModelValueProp, ModelValidatorProp, Elements, ToggleVariant, Theme, Size, Radius, Spacing, ModelWrapper } from '../../types'

defineOptions({ inheritAttrs: false })
const props = defineProps({
	//----- Model -----
    modelValue: {
        type: [String, Object] as ModelValueProp<string>,
        default: () => {
            const groupProps = inject('radio-group-props', { model: '' })
            return groupProps.model
        }
    },
    ['onUpdate:modelValue']: Function,
    validator: Function as ModelValidatorProp<string>,
    eagerValidation: Boolean,
    elements: Object as PropType<Elements>,

    checked: Boolean,
    value: {
        type: String,
        default: 'on'
    },
    name: String,
    label: String,
    description: String,
    variant: {
        type: String as PropType<ToggleVariant>,
        default: () => vergil.config.radio.variant,
        validator: (v: string) => isValidVariant('ToggleButton', v)
    },
    showSymbol: Boolean,
    radioRadius: {
        type: String as PropType<Radius>,
        default: () => vergil.config.radio.radioRadius,
        validator: isValidRadius
    },
    disabled: Boolean,
    class: [String, Object],

    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        validator: isValidSpacing
    }
})
const groupProps = inject('radio-group-props', null) as null | {
    model: ModelWrapper<string | string[]>;
    readonly name: string;
    readonly eagerValidation: boolean;
    readonly disabled: boolean;
}

const descendant = computed(() => props.descendant || isObject(groupProps))
const theme = computed(() => props.theme ?? (descendant.value ? undefined : (vergil.config.radio.theme ?? vergil.config.global.theme)))
const size = computed(() => props.size ?? (descendant.value ? undefined : (vergil.config.radio.size ?? vergil.config.global.size)))
const radius = computed(() => props.radius ?? (descendant.value ? undefined : (vergil.config.radio.radius ?? vergil.config.global.radius)))
const spacing = computed(() => props.spacing ?? (descendant.value ? undefined : (vergil.config.radio.spacing ?? vergil.config.global.spacing)))

const elements = useDefineElements(['input'])
const model = useDefineModel<string>()
const eagerValidation = toRef(() => props.eagerValidation || Boolean(groupProps?.eagerValidation))

if(props.checked && model.value === '') {
    model.value = props.value
}

model.onExternalUpdate(modelValue => {
    (elements.input as HTMLInputElement).checked = modelValue === (elements.input as HTMLInputElement).value
}, { onMounted: true })
function handleChange(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
        model.update((event.target as HTMLInputElement).value)
        model.handleValidation(eagerValidation.value)
    }
}

const themeClass = computed(() => {
	return model.error
		? 'invalid' + (theme.value ? ' danger' : '')
		: theme.value && inferTheme(theme.value)
})
</script>

<template>
    <ToggleButton type="radio" :label :description
        :variant
        :showSymbol
        :radius="radioRadius"
        :class="[props.class, themeClass, {
            [`size-${size}`]: size,
            [`radius-${radius}`]: radius,
            [`spacing-${spacing}`]: spacing
        }]">
        <template #input>
            <input
                v-bind="$attrs"
                type="radio"
                :ref="elements.getRef('input')"
                :value
                :name="name || groupProps?.name"
                :disabled="disabled || groupProps?.disabled"
                @change="handleChange"
            >
        </template>
        <template v-for="(_,name) in $slots" #[name]>
            <slot :name/>
        </template>
    </ToggleButton>
</template>