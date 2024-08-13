<script setup>
import FormField from '../utils/FormField.vue'
import MiniMarkup from "../utils/MiniMarkup.vue"
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
defineEmits(['update:modelValue'])

const props = defineProps({
    //----- Initial value and model -----
    checked: Boolean,
    valueOn: {
        type: [String, Boolean],
        default: true,
    },
    valueOff: {
        type: [String, Boolean],
        default: props => (typeof props.valueOn === 'string') ? '' : false
    },
    modelValue: {
        default: props => useModel(props.checked ? props.valueOn : props.valueOff),
        validator: isModel
    },

    //----- Component specific -----
    labelOn: String,
    labelOff: String,
    evenTrack: Boolean,
    
    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,

    //----- Appearance -----
    theme: {
        type: String,
        default: () => vergil.config.switch.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.switch.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.switch.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: () => vergil.config.switch.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    disabled: Boolean,
    class: [String, Object]
})

const model = useModel(props.modelValue)
</script>

<template>
    <FormField :class="['switch', props.class]"
        :label :hint :description :help
        :size :radius :spacing
        >
        <label class="switch-button">
            <input
                v-bind="$attrs"
                v-model="model.value"
                :true-value="valueOn"
                :false-value="valueOff"
                :ref="model.getRef('el')"
                type="checkbox"
                :disabled
                >
            <label v-if="labelOff">
                <MiniMarkup :str="labelOff"/>
            </label>
            <span
                :class="[
                    'switch-track',
                    inferTheme(theme), 
                    { evenTrack }
                ]">
                <span class="switch-circle"/>
            </span>
            <label v-if="labelOn">
                <MiniMarkup :str="labelOn"/>
            </label>
        </label>
    </FormField>
</template>

<style>
.switch-button {
    font-size: var(--g-font-size);
    line-height: var(--line-height-text);
    display: flex;
    column-gap: var(--g-gap-1);
    border: none;
    color: var(--c-text);
    cursor: pointer;

    &:focus-visible {
        outline: 0 solid transparent;
    }
    &:has(input:disabled){
        color: var(--c-disabled-text);
        cursor: not-allowed;
    }

    & > input {
        position: absolute;
        margin: 0;
        appearance: none;
        opacity: 0;

        &:focus-visible ~ .switch-track {
            outline: 2px solid var(--c-theme-outline);
            outline-offset: 2px;
        }   
        &:checked ~ .switch-track {
            background-color: var(--c-theme-1);
            & > .switch-circle {
                left: calc(var(--base));
                background-color: var(--c-theme-text-1);
            }
        }
        &:disabled ~ .switch-track {
            background-color: var(--c-disabled-1);
            & > .switch-circle {
                background-color: var(--c-disabled-text);
            }
        }
        &:disabled:checked ~ .switch-track,
        &:disabled ~ .switch-track.evenTrack {
            background-color: var(--c-disabled-border);
            & > .switch-circle {
                background-color: var(--c-bg);
            }
        }
    }
    & > .switch-track {
        --base: 1em * var(--font-size-scale-icon) * var(--line-height-icon);
        --ratio: 0.6;

        box-sizing: border-box;
        position: relative;
        display: flex;
        align-items: center;
        width: calc(var(--base) * 2);
        height: calc(var(--base));
        border-width: calc(var(--base) * 0.5 * (1 - var(--ratio)));
        border-style: solid;
        border-color: transparent;
        border-radius: var(--g-radius);
        background-color: var(--c-grey-soft-4);
        transition: background-color 150ms;

        & > .switch-circle {
            position: absolute;
            left: 0;
            height: 100%;
            aspect-ratio: 1 / 1;
            border-radius: inherit;
            background-color: var(--c-grey-text-1);
            transition: left 150ms, background-color 150ms;
        }
        &.evenTrack {
            background-color: var(--c-theme-1);
            & > .switch-circle {
                background-color: var(--c-theme-text-1);;
            }
        }
    }
}
</style>