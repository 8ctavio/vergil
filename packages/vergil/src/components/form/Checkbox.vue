<script setup lang="ts">
import { toRef, computed, inject } from 'vue'
import { vergil } from '#vergil'
import { ToggleButton } from '#components'
import { useDefineModel, useDefineElements } from '#composables'
import { isObject, inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '#utilities'
import type { PropType } from 'vue'
import type { ToggleVariant } from '#components'
import type { ModelValueProp, ModelValidatorProp, ModelWrapper, Elements } from '#composables'
import type { Theme, Size, Radius, Spacing } from '#utilities'

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
        default: (props: { value?: string | boolean }) => props.value ?? true
    },
    valueUnchecked: {
        type: [String, Boolean],
        default: (props: { valueChecked: string | boolean }) => (typeof props.valueChecked === 'string') ? '' : false
    },
    modelValue: {
        type: [String, Boolean, Object] as ModelValueProp<boolean | string | string[]>,
        default: (props: { valueUnchecked: string | boolean }) => {
            const groupProps = inject('checkbox-group-props', {
                model: props.valueUnchecked
            })
            return groupProps.model
        }
    },
    ['onUpdate:modelValue']: Function,
    validator: Function as ModelValidatorProp<boolean | string | string[]>,
    eagerValidation: Boolean,
    elements: Object as PropType<Elements>,

    label: String,
    description: String,
    variant: {
        type: String as PropType<ToggleVariant>,
        default: () => vergil.config.checkbox.variant,
        validator: (v: string) => isValidVariant('ToggleButton', v)
    },
    showSymbol: Boolean,
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
const groupProps = inject('checkbox-group-props', null) as null | {
    model: ModelWrapper<string | string[]>;
    readonly name: string;
    readonly eagerValidation: boolean;
    readonly disabled: boolean;
}

const descendant = computed(() => props.descendant || isObject(groupProps))
const theme = computed(() => props.theme ?? (descendant.value ? undefined : (vergil.config.checkbox.theme ?? vergil.config.global.theme)))
const size = computed(() => props.size ?? (descendant.value ? undefined : (vergil.config.checkbox.size ?? vergil.config.global.size)))
const radius = computed(() => props.radius ?? (descendant.value ? undefined : (vergil.config.checkbox.radius ?? vergil.config.global.radius)))
const spacing = computed(() => props.spacing ?? (descendant.value ? undefined : (vergil.config.checkbox.spacing ?? vergil.config.global.spacing)))

const elements = useDefineElements(['input'])
const model = useDefineModel({ isCollection: true })
const eagerValidation = toRef(() => props.eagerValidation || Boolean(groupProps?.eagerValidation))

if (props.checked) {
    if (Array.isArray(model.value)) {
        if (!model.value.includes(props.valueChecked)) {
            model.value.push(props.valueChecked)
            model.triggerIfShallow()
        }
    } else if (model.value === props.valueUnchecked) {
        model.value = props.valueChecked
    }
}

model.onExternalUpdate(modelValue => {
    (elements.input as HTMLInputElement).checked = Array.isArray(modelValue)
        ? modelValue.includes(props.valueChecked)
        : modelValue === props.valueChecked
}, { onMounted: true })
const handleChange = model.updateDecorator((event: Event) => {
    if (Array.isArray(model.value)) {
        const idx = model.value.indexOf(props.valueChecked)
        if (idx > -1) {
            if (!(event.target as HTMLInputElement).checked) {
                model.value.splice(idx, 1)
                model.triggerIfShallow()
                model.handleValidation(eagerValidation.value)
            }
        } else if ((event.target as HTMLInputElement).checked) {
            model.value.push(props.valueChecked)
            model.triggerIfShallow()
            model.handleValidation(eagerValidation.value)
        }
    } else {
        model.value = (event.target as HTMLInputElement).checked ? props.valueChecked : props.valueUnchecked
        model.handleValidation(eagerValidation.value)
    }
})

const themeClass = computed(() => {
	return model.hasErrors
		? 'invalid' + (theme.value ? ' danger' : '')
		: theme.value && inferTheme(theme.value)
})
</script>

<template>
    <ToggleButton type="checkbox" :label :description
        :variant
        :showSymbol
        :class="[props.class, themeClass, {
            [`size-${size}`]: size,
            [`radius-${radius}`]: radius,
            [`spacing-${spacing}`]: spacing
        }]">
        <template #input>
            <input
                v-bind="$attrs"
                type="checkbox"
                :ref="elements.getRef('input')"
                :value="valueChecked"
                :disabled="disabled || groupProps?.disabled"
                @change="handleChange"
            >
        </template>
        <template v-for="(_,name) in $slots" #[name]>
            <slot :name/>   
        </template>
    </ToggleButton>
</template>