<script setup>
import FormField from './FormField.vue'
import checkbox from '../form/Checkbox.vue'
import radio from '../form/Radio.vue'
import { provide, toRef, h } from 'vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: v => ['checkbox', 'radio'].includes(v)
    },

    //----- Model -----
    value: {
        type: [String, Array],
        default: props => props.type === 'checkbox' ? [] : '',
    },
    modelValue: {
        default: props => useModel(props.value),
        validator: isModel
    },

    //----- Component specific -----
    name: String,
    options : {
        type: [Array, Object],
        default: () => ([])
    },
    optionValue: {
        type: [String, Function],
        default: () => (option => Array.isArray(option) ? option[0] : option)
    },
    optionLabel: {
        type: [String, Function],
        default: () => (option => Array.isArray(option) ? option[0] : option)
    },
    optionDescription: {
        type: [String, Function],
        default: () => (option => Array.isArray(option) ? option[1] : undefined)
    },
    variant: {
        type: String,
        default: props => vergil.config[props.type].variant,
        validator: v => isValidVariant('ToggleButton', v)
    },
    direction: {
        type: String,
        default: props => ['card', 'toggle'].includes(props.variant) ? 'row' : 'column',
        validator: v => ['column', 'row'].includes(v)
    },
    
    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,

    //----- Appearance -----
    theme: {
        type: String,
        default: props => vergil.config[props.type].theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: props => vergil.config[props.type].size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: props => {
            return vergil.config[props.type].radius ?? (
                (props.type === 'radio' && props.variant === 'classic') ? 'full'
                : vergil.config.global.radius
            )
        },
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: props => vergil.config[props.type].spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    disabled: Boolean,
    class: [String, Object],
})

const model = useModel(props.modelValue)

provide(`${props.type}-props`, {
    groupModel: model,
    groupName: toRef(() => props.name),
    groupDisabled: toRef(() => props.disabled),
    groupTheme: toRef(() => props.theme)
})

function Options({ options }) {
    if(options === null) return
    const component = { checkbox, radio }[props.type]
    function decodeOption(option, decoder) {
        const decoded = typeof decoder === 'function'
            ? decoder(option)
            : typeof option === 'object' && option !== null
                ? option[decoder]
                : option
        return decoded?.toString().trim()
    }
    function createOptionVNode(idx, option, key) {
        const value = decodeOption(key ?? option, props.optionValue)
        return h(component, {
            key: value + idx,
            value,
            label: decodeOption(option, props.optionLabel),
            description: decodeOption(option, props.optionDescription),
            variant: props.variant
        })
    }
    if(Array.isArray(options)) {
        return options.map((option, idx) => {
            return createOptionVNode(idx, option)
        })
    } else {
        return Object.entries(options).map(([key, option], idx) => {
            return createOptionVNode(idx, option, key)
        })
    }
}
</script>

<template>
    <FormField :class="[`${type}-group`, props.class]"
        :label :hint :description :help
        :size :radius :spacing
        >
        <div
            v-bind="$attrs"
            :ref="model.refs.el"
            :class="['toggle-group-wrapper', variant, inferTheme(theme)]">
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

    &.classic {
        column-gap: var(--g-gap-xl);
        row-gap: var(--g-gap-md);
    }
    &.card {
        column-gap: var(--g-gap-lg);
        row-gap: var(--g-gap-md);
    }
    &.toggle {
        gap: var(--g-gap-sm);
        padding: var(--g-gap-sm);
        border-radius: var(--g-radius);
        background-color: var(--c-grey-soft-3);

        &:has(input:is([type="checkbox"],[type="radio"]):disabled) {
            background-color: var(--c-disabled-1);
        }
    }
    &.list {
        gap: var(--g-gap-xs);
        padding: var(--g-gap-sm);
        border-radius: var(--g-radius);
        background-color: #FCFCFC;
    }
}
.dark .toggle-group-wrapper {
    &:is(.toggle, .list) {
        background-color: #0A0A0A;
    }
}
</style>