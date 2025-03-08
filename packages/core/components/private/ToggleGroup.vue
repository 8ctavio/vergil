<script>
import checkbox from '../form/Checkbox.vue'
import radio from '../form/Radio.vue'

function decodeOption(decoder, option, key) {
    const decoded = isFunction(decoder)
        ? decoder(option,key)
        : isObject(option)
            ? option[decoder]
            : option
    return decoded?.toString().trim()
}
function createOptionVNode(props, option, key) {
    const component = { checkbox, radio }[props.type]
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

<script setup>
import FormField from './FormField.vue'
import { toRef, provide, h } from 'vue'
import { vergil } from '../../vergil'
import { useDefineModel, useDefineElements } from '../../composables'
import { isFunction, isObject } from '../../utilities'
import { isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
const props = defineProps({
    //----- Model -----
    type: {
        type: String,
        required: true,
        validator: v => ['checkbox', 'radio'].includes(v)
    },
    value: {
        type: [String, Array],
        default: props => props.type === 'checkbox' ? [] : '',
    },
    modelValue: {
        type: [String, Object],
        default: props => props.value
    },
    ['onUpdate:modelValue']: Function,
    validator: Function,
    showErrors: Boolean,
    elements: Object,

    //----- Component specific -----
    name: String,
    options : {
        type: Object,
        default: () => ([])
    },
    optionValue: {
        type: [String, Function],
        default: () => (
            (option, key) => typeof key === 'number'
                ? Array.isArray(option) ? option[0] : option
                : key
        )
    },
    optionLabel: {
        type: [String, Function],
        default: () => (option => Array.isArray(option) ? option[0] : option)
    },
    optionDescription: {
        type: [String, Function],
        default: () => (option => Array.isArray(option) ? option[1] : undefined)
    },
    optionsAttributes: [Object, Function],
    variant: {
        type: String,
        default: props => vergil.config[props.type].variant,
        validator: v => isValidVariant('ToggleButton', v)
    },
    showSymbol: Boolean,
    direction: {
        type: String,
        default: props => ['card', 'toggle'].includes(props.variant) ? 'row' : 'column',
        validator: v => ['column', 'row'].includes(v)
    },
    disabled: Boolean,
    class: [String, Object],
    
    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,

    //----- Global -----
    descendant: Boolean,
    theme: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config[props.type].theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config[props.type].size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String,
        default: props => {
            return (props.type === 'radio' && props.variant === 'classic')
                ? (vergil.config[props.type].radius ?? 'full')
                : (props.descendant ? undefined : (vergil.config[props.type].radius ?? vergil.config.global.radius))
        },
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config[props.type].spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})

const elements = useDefineElements(['options'])

const model = useDefineModel({ isCollection: true })
provide(`${props.type}-group-props`, {
    model,
    name: toRef(() => props.name),
    disabled: toRef(() => props.disabled),
})

function Options({ options }) {
    if(options !== null) {
        if(Array.isArray(options)) {
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
            :ref="elements.refs.options"
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