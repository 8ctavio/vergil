<script setup>
import MiniMarkup from '../utils/MiniMarkup.vue'
import { computed, inject } from 'vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel, isModelWrapper } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
defineEmits(['update:modelValue'])

const props = defineProps({
    modelValue: {
        validator: v => isModel(v) || isModelWrapper(v)
    },
    name: String,
    label: String,
    description: String,
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
    },
    disabled: Boolean,
    class: [String, Object]
})
const {
    groupModel,
    groupName,
    groupDisabled,
    groupTheme
} = inject('radio-props', {})

const model = useModel(props.modelValue ?? groupModel ?? useModel(''))

const theme = computed(() => props.theme ?? groupTheme?.value ?? vergil.config.radio.theme ?? vergil.config.global.theme)
const size = computed(() => props.size ?? (groupTheme ? '' : (vergil.config.radio.size ?? vergil.config.global.size)))
const radius = computed(() => props.radius ?? (groupTheme ? '' : vergil.config.radio.radius))
const spacing = computed(() => props.spacing ?? (groupTheme ? '' : (vergil.config.radio.spacing ?? vergil.config.global.spacing)))
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
            :ref="model.getRef('el')"
            type="radio"
            :name="name || groupName"
            :disabled="disabled || groupDisabled"
            >
        <span class="radio-button">
            <span class="radio-circle"/>
        </span>
        <div v-if="label">
            <p class="radio-label">
                <slot>
                    <MiniMarkup :str="label"/>
                </slot>
            </p>
            <p v-if="description" class="radio-description">
                <slot name="description">
                    <MiniMarkup :str="description"/>
                </slot>
            </p>
        </div>
    </label>
</template>

<style>
.radio {
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
    &:hover > .radio-button {
        border-color: var(--c-theme-1);
    }

    & > input[type="radio"] {
        appearance: none;
        pointer-events: none;
        position: absolute;
        margin: 0;
        opacity: 0;

        &:focus-visible + .radio-button {
            outline: 2px solid var(--c-theme-outline);
            outline-offset: 2px;
        }   
        &:checked + .radio-button {
            background-color: var(--c-theme-1);
            border-color: var(--c-theme-1);
            & > .radio-circle {
                opacity: 1;
                transform: scale(0.5);
            }
        }
        &:disabled {
            & + .radio-button {
                border-color: var(--c-disabled-1);
                background-color: var(--c-disabled-2);
            }
            &:checked + .radio-button {
                border-color: var(--c-disabled-border);
                background-color: var(--c-disabled-border);
                & > .radio-circle {
                    background-color: var(--c-disabled-2);
                }
            }
        }
    }
    & > .radio-button {
        position: relative;
        width: calc(1em * var(--font-size-scale-icon));
        height: calc(1em * var(--font-size-scale-icon));
        border-radius: var(--g-radius);
        border: 2px solid var(--c-grey-border-2);
        transition: border-color 150ms;

        & > .radio-circle {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background-color: var(--c-theme-icon-1);
            opacity: 0;
            transform: scale(0);
            transition: opacity 150ms, transform 200ms var(--bezier-bounce-out);
        }
    }
    & > div {
        display: flex;
        flex-direction: column;
        row-gap: calc(0.5 * var(--g-gap-1));
        & > .radio-description {
            font-size: 0.9em;
            color: var(--c-grey-text-3);
        }
    }
}
</style>