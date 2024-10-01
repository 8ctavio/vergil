<script setup>
import FormField from './FormField.vue'
import Checkbox from '../form/Checkbox.vue'
import Radio from '../form/Radio.vue'
import { provide, toRef } from 'vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../../utilities/private'

defineOptions({
    components: { Checkbox, Radio }
})

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
    options: Object,
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
})

const model = useModel(props.modelValue)

provide(`${props.type}-props`, {
    groupModel: model,
    groupName: toRef(() => props.name),
    groupDisabled: toRef(() => props.disabled),
    groupTheme: toRef(() => props.theme)
})
</script>

<template>
    <FormField :class="`${type}-group`"
        :label :hint :description :help
        :size :radius :spacing
        >
        <div :class="['toggle-group-wrapper', variant, inferTheme(theme)]" :ref="model.refs.el">
            <slot>
                <component :is="type" v-for="(text,value) in options" :key="value"
                    :value="value.toString()"
                    :variant
                    :label="Array.isArray(text) ? text[0] : text"
                    :description="Array.isArray(text) ? text[1] : undefined"
                    />
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