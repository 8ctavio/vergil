<script lang="ts">
import { vergil } from '#vergil'
import { Checkbox as checkbox, Radio as radio } from '#components'
import { isFunction, isObject, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '#utilities'
import type { ExtractPropTypes, PropType } from 'vue'
import type { ModelValueProp, ModelValidatorProp, Elements, ToggleVariant, SelectionOptions, SelectionOptionProperty, Theme, Size, Radius, Spacing } from '../../types'

type ToggleType = 'checkbox' | 'radio'
type Props = ExtractPropTypes<typeof propsDefinition>

const propsDefinition = {
    //----- Model -----
    type: {
        type: String as PropType<'checkbox' | 'radio'>,
        required: true as const,
        validator: (v: string) => ['checkbox', 'radio'].includes(v)
    },
    value: {
        type: [String, Array] as PropType<string | string[]>,
        default: (props: { type: ToggleType }) => props.type === 'checkbox' ? [] : '',
    },
    modelValue: {
        type: [String, Object] as ModelValueProp<string | string[]>,
        default: (props: { value: string | string[] }) => props.value
    },
    ['onUpdate:modelValue']: Function,
    validator: Function as ModelValidatorProp<string | string[]>,
    eagerValidation: Boolean,
    elements: Object as PropType<Elements>,

    //----- Component specific -----
    name: String,
    options : {
        type: Object as PropType<SelectionOptions>,
        default: () => ([])
    },
    optionValue: {
        type: [String, Function] as PropType<SelectionOptionProperty>,
        default: () => (
            (option: unknown, key: string | number) => typeof key === 'number'
                ? Array.isArray(option) ? option[0] : option
                : key
        )
    },
    optionLabel: {
        type: [String, Function] as PropType<SelectionOptionProperty>,
        default: () => ((option: unknown) => Array.isArray(option) ? option[0] : option)
    },
    optionDescription: {
        type: [String, Function] as PropType<SelectionOptionProperty>,
        default: () => ((option: unknown) => Array.isArray(option) ? option[1] : undefined)
    },
    optionsAttributes: [Object, Function] as PropType<
        | Record<string, unknown>
        | ((key: string | number, value: string, label: string, description: string) => Record<string, unknown>)
    >,
    variant: {
        type: String as PropType<ToggleVariant>,
        default: (props: { type: ToggleType }) => vergil.config[props.type].variant,
        validator: (v: string) => isValidVariant('ToggleButton', v)
    },
    showSymbol: Boolean,
    direction: {
        type: String as PropType<'column' | 'row'>,
        default: (props: { variant: ToggleVariant }) => ['card', 'toggle'].includes(props.variant) ? 'row' : 'column',
        validator: (v: string) => ['column', 'row'].includes(v)
    },
    disabled: Boolean,
    class: [String, Object],
    
    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,
    showErrors: Boolean,

    //----- Global -----
    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { type: ToggleType, descendant?: boolean }) => props.descendant ? undefined : (vergil.config[props.type].theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { type: ToggleType, descendant?: boolean }) => props.descendant ? undefined : (vergil.config[props.type].size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { type: ToggleType, descendant?: boolean, variant?: ToggleVariant }) => {
            return (props.type === 'radio' && props.variant === 'classic')
                ? (vergil.config[props.type].radius ?? 'full')
                : (props.descendant ? undefined : (vergil.config[props.type].radius ?? vergil.config.global.radius))
        },
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { type: ToggleType, descendant?: boolean }) => props.descendant ? undefined : (vergil.config[props.type].spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
}

function decodeOption(decoder: string | Function, option: unknown, key: string | number) {
    const decoded = isFunction(decoder)
        ? decoder(option,key)
        : isObject(option)
            ? (option as Record<string, unknown>)[decoder]
            : option
    return decoded?.toString().trim()
}

function createOptionVNode(props: Props, option: unknown, key: string | number) {
    const component = { checkbox, radio }[props.type] as unknown as InstanceType<typeof checkbox> | InstanceType<typeof radio>
    const value = decodeOption(props.optionValue, option, key)
    const label = decodeOption(props.optionLabel, option, key)
    const description = decodeOption(props.optionDescription, option, key)
    return h(component, {
        ...(isFunction(props.optionsAttributes)
            ? props.optionsAttributes(key, value, label, description)
            : props.optionsAttributes),
        key,
        value,
        label,
        description,
        variant: props.variant,
        showSymbol: props.showSymbol,
    })
}
</script>

<script setup lang="ts">
import FormField from './FormField.vue'
import { provide, h } from 'vue'
import { useDefineModel, useDefineElements } from '#composables'

defineOptions({ inheritAttrs: false })
const props = defineProps(propsDefinition)

const elements = useDefineElements(['options'])

const model = useDefineModel({ isCollection: true })
provide(`${props.type}-group-props`, {
    model,
    get name() { return props.name },
    get eagerValidation() { return props.eagerValidation },
    get disabled() { return props.disabled },
})

function Options({ options }: { options: Props['options'] }) {
    if (options !== null) {
        if (Array.isArray(options)) {
            return options.map((option, idx) => {
                return createOptionVNode(props, option, idx)
            })
        } else {
            return Object.entries(options).map(([key, option]) => {
                return createOptionVNode(props, option, key)
            })
        }
    }
}
</script>

<template>
    <FormField :class="[`${type}-group`, props.class]"
        :label :hint :description :help
        :theme :size :radius :spacing
        :showErrors :errors="model.errors"
    >
        <div
            v-bind="$attrs"
            :ref="elements.getRef('options')"
            :class="['toggle-group-wrapper', variant]"
        >
            <slot>
                <Options :options/>
            </slot>
        </div>
    </FormField>
</template>

<style>
.toggle-group-wrapper {
    display: flex;
    flex-direction: v-bind(direction);
    align-items: start;

    &.classic {
        column-gap: var(--g-gap-3xl);
        row-gap: var(--g-gap-md);
    }
    &.card {
        column-gap: var(--g-gap-2xl);
        row-gap: var(--g-gap-md);
    }
    &.list {
        gap: var(--g-gap-xs);
        padding: var(--g-gap-sm);
        border-radius: var(--g-radius-md);
        background-color: var(--c-bg);
    }
    &.toggle {
        gap: var(--g-gap-sm);
        padding: var(--g-gap-sm);
        border-radius: var(--g-radius-md);
        background-color: var(--c-bg-alt);
    }

    & > :is(.checkbox,.radio) {
        width: 100%;
        min-width: max-content;
    }
}
</style>