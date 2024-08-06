<script setup>
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel, isModelWrapper } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
defineEmits(['update:modelValue'])

const props = defineProps({
    modelValue: {
        default: () => useModel(''),
        validator: v => isModel(v) || isModelWrapper(v)
    },
    label: String,
    theme: {
        type: String,
        default: () => vergil.config.radio.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.radio.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.radio.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: () => vergil.config.radio.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    disabled: Boolean,
    class: [String, Object]
})

const model = useModel(props.modelValue)
</script>

<template>
    <label
        :class="[
            'radio',
            inferTheme(theme),
            `size-${size}`,
            `radius-${radius}`,
            `spacing-${spacing}`,
            props.class,
        ]">
        <input
            v-bind="$attrs"
            v-model="model.value"
            type="radio"
            :disabled
            >
        <span class="radio-icon" >
            <span class="radio-icon-outer"/>
            <span class="radio-icon-inner"/>
        </span>
        <slot>{{ label }}</slot>
    </label>
</template>

<style>
.radio {
    --radio-c-border: var(--c-theme-1);

    font-size: var(--g-font-size);
    line-height: var(--line-height-text);
    position: relative;
    display: flex;
    column-gap: var(--g-gap-1);
    color: var(--c-text);
    cursor: pointer;

    &:has(input:disabled){
        color: var(--c-disabled-text);
        cursor: not-allowed;
    }
    &:hover > .radio-icon {
        box-shadow: inset 0 0 0 1px var(--radio-c-border);
    }

    & > input {
        position: absolute;
        margin: 0;
        appearance: none;
        opacity: 0;

        &:focus-visible + .radio-icon {
            outline: 2px solid var(--c-theme-outline);
            outline-offset: 2px;
        }   
        &:checked + .radio-icon {
            box-shadow: inset 0 0 0 1px var(--radio-c-border);
            & > .radio-icon-outer {
                opacity: 1;
            }
            & > .radio-icon-inner {
                transform: scale(0.4);
            }
        }
        &:not(:checked) + .radio-icon {
            & > .radio-icon-outer {
                transition: opacity 150ms;
            }
        }
        &:disabled + .radio-icon {
            box-shadow: inset 0 0 0 1px var(--c-disabled-border);
            & > .radio-icon-outer {
                background-color: var(--c-disabled-border);
            }
            & > .radio-icon-inner {
                background-color: var(--c-disabled-2);
            }
        }
    }
    & > .radio-icon {
        position: relative;
        width: calc(1em * var(--font-size-scale-icon));
        height: calc(1em * var(--font-size-scale-icon));
        border-radius: var(--g-radius);
        box-shadow: inset 0 0 0 1px var(--c-grey-border-2);
        transition: box-shadow 150ms;

        & > .radio-icon-outer {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background-color: var(--radio-c-border);
            opacity: 0;
        }
        & > .radio-icon-inner {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background-color: var(--c-bg);
            transform: scale(0);
            transition: transform 200ms var(--bezier-bounce-out);
        }
    }
}
.dark .radio {
    --radio-c-border: var(--c-theme-border-1);
}
</style>