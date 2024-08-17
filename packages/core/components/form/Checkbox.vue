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
    groupDisabled,
    groupTheme
} = inject('checkbox-props', {})

const model = useModel(props.modelValue ?? groupModel ?? useModel(props.checked ? props.valueChecked : props.valueUnchecked))

const theme = computed(() => props.theme ?? groupTheme?.value ?? vergil.config.checkbox.theme ?? vergil.config.global.theme)
const size = computed(() => props.size ?? (groupTheme ? '' : (vergil.config.checkbox.size ?? vergil.config.global.size)))
const radius = computed(() => props.radius ?? (groupTheme ? '' : (vergil.config.checkbox.radius ?? vergil.config.global.radius)))
const spacing = computed(() => props.spacing ?? (groupTheme ? '' : (vergil.config.checkbox.spacing ?? vergil.config.global.spacing)))
</script>

<template>
    <label
        :class="[
            'checkbox',
            inferTheme(theme),
            `size-${size}`,
            `radius-${radius}`,
            `spacing-${spacing}`,
            props.class,
        ]">
        <input
            v-bind="$attrs"
            v-model="model.value"
            :value="valueChecked"
            :true-value="valueChecked"
            :false-value="valueUnchecked"
            :ref="model.getRef('el')"
            type="checkbox"
            :disabled="disabled || groupDisabled"
            >
        <span class="checkbox-box">
            <svg class="checkbox-check" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                <path d="m382-388 321-321q19-19 45-19t45 19q19 19 19 45t-19 45L427-253q-19 19-45 19t-45-19L167-423q-19-19-19-45t19-45q19-19 45-19t45 19l125 125Z"/>
            </svg>
        </span>
        <div v-if="label">
            <p class="checkbox-label">
                <slot>
                    <MiniMarkup :str="label"/>
                </slot>
            </p>
            <p v-if="description" class="checkbox-description">
                <slot name="description">
                    <MiniMarkup :str="description"/>
                </slot>
            </p>
        </div>
    </label>
</template>

<style>
.checkbox {
    font-size: var(--g-font-size);
    line-height: var(--line-height-text);
    position: relative;
    display: flex;
    column-gap: var(--g-gap-md);
    color: var(--c-text);
    cursor: pointer;

    &:has(input:disabled){
        color: var(--c-disabled-text);
        cursor: not-allowed;
    }
    &:hover > .checkbox-box {
        border-color: var(--c-theme-1);
    }

    & > input[type="checkbox"] {
        appearance: none;
        pointer-events: none;
        position: absolute;
        margin: 0;
        opacity: 0;

        &:focus-visible + .checkbox-box {
            outline: 2px solid var(--c-theme-outline);
            outline-offset: 2px;
        }   
        &:checked + .checkbox-box {
            background-color: var(--c-theme-1);
            border-color: var(--c-theme-1);
            & > .checkbox-check {
                opacity: 1;
                transform: scale(1);
            }
        }
        &:disabled {
            & + .checkbox-box {
                border-color: var(--c-disabled-1);
                background-color: var(--c-disabled-2);
            }
            &:checked + .checkbox-box {
                border-color: var(--c-disabled-border);
                background-color: var(--c-disabled-border);
                & > .checkbox-check {
                    fill: var(--c-disabled-2);
                }
            }
        }
    }
    & > .checkbox-box {
        box-sizing: border-box;
        position: relative;
        width: calc(1em * var(--font-size-scale-icon));
        height: calc(1em * var(--font-size-scale-icon));
        border-radius: var(--g-radius);
        border: 2px solid var(--c-grey-border-2);
        transition: background-color 150ms, border-color 150ms;

        & > .checkbox-check {
            position: absolute;
            inset: 0;
            fill: var(--c-theme-icon-1);
            opacity: 0;
            transform: scale(0);
            transition: opacity 150ms, transform 200ms var(--bezier-bounce-out);
        }
    }
    & > div {
        display: flex;
        flex-direction: column;
        row-gap: var(--g-gap-xs);
        & > .checkbox-description {
            font-size: 0.9em;
            color: var(--c-grey-text-3);
        }
    }
}
</style>