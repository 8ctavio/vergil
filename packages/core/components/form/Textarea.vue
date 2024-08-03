<script setup>
import FormField from '../utils/FormField.vue'
import MiniMarkup from "../utils/MiniMarkup.vue"
import { computed, toRef } from 'vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities/private'

defineOptions({ inheritAttrs: false })

const props = defineProps({
    //----- Model -----
    value: {
        type: String,
        default: ''
    },
    modelValue: {
        default: props => useModel(props.value),
        validator: isModel
    },

    //----- Component specific -----
    placeholder: String,
    max: String,
    textAlign: {
        type: String,
        default: 'left',
        validator: v => ['left', 'center', 'right'].includes(v),
    },
    rows: String,
    resize: Boolean,
    
    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,
    floatLabel: Boolean,

    underline: {
        type: Boolean,
        default: () => vergil.config.textarea.underline
    },
    theme: {
        type: String,
        default: () => vergil.config.textarea.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.textarea.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.textarea.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: () => vergil.config.textarea.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    disabled: Boolean,
    class: { default: '' }
})
const classAttr = toRef(() => props.class)

const model = useModel(props.modelValue)

const canLabelFloat = computed(() => Boolean(props.floatLabel && props.label && !props.description))
</script>

<template>
    <FormField class="textarea" :class="classAttr"
        :label :hint :description :help :float-label="canLabelFloat"
        :size :radius :spacing
        >
        <div :class="['textarea-wrapper', inferTheme(theme), { underline }]">
            <textarea
                v-bind="$attrs"
                v-model="model.value"
                :ref="model.getRef('el')"
                :class="[`text-${textAlign}`, { resize }]"
                :placeholder="canLabelFloat ? '' : placeholder"
                :maxlength="max"
                :rows
                :disabled
            />
            <label v-if="canLabelFloat">
                <MiniMarkup :str="label"/>
            </label>
        </div>
    </FormField>
</template>

<style>
.textarea-wrapper{
    --textarea-bw-b: 0.5px;
    --textarea-bc: var(--c-grey-border-1);
    --textarea-bc-b: var(--c-grey-border-1);

    font-size: 1em;
    position: relative;
    display: flex;
    align-items: center;
    column-gap: var(--g-gap-1);
    width: 100%;
    border-radius: var(--g-radius);
    background-color: var(--c-bg);
    color: var(--c-text);
    box-shadow: inset 0 calc(var(--textarea-bw-b) * -1) var(--textarea-bc-b),
                inset 0 0.5px var(--textarea-bc),
                inset 0.5px 0 var(--textarea-bc),
                inset -0.5px 0 var(--textarea-bc);
    outline: 0 solid transparent;
    transition: background-color 150ms, box-shadow 150ms;

    &:has(textarea:focus-visible){
        outline: 2px solid var(--c-theme-outline);
    }
    &:has(textarea:disabled){
        --textarea-bc: var(--c-disabled-border);
        --textarea-bc-b: var(--c-disabled-border);
        color: var(--c-disabled-text);
        background-color: var(--c-disabled-2);
        & > textarea{
            cursor: not-allowed;
        }
    }
    &.underline {
        --textarea-bw-b: 2px;
        --textarea-bc-b: var(--c-theme-1);
    }

    & > textarea{
        font-size: 1em;
        font-family: var(--font-sans);
        width: 100%;
        padding: var(--g-gap-1) var(--g-gap-2);
        background-color: transparent;
        outline: 0 solid transparent;
        resize: none;

        &.text-left{ text-align: left; }
        &.text-center{ text-align: center; }
        &.text-right{ text-align: right; }
        &.resize{ resize: vertical; }
        &::placeholder{
            color: var(--c-grey-1);
        }
        &:placeholder-shown:not(:focus) + label{
            font-size: 1em;
            padding: var(--g-gap-1) var(--g-gap-2);
            transform: translateY(0);
            color: var(--c-grey-1);
            font-weight: 400;
            transition: transform 150ms 50ms, padding 150ms, font-size 150ms 50ms, color 150ms 50ms;
        }
    }
    & > label{
        font-size: 0.9em;
        position: absolute;
        top: 0;
        left: 0;
        color: var(--c-text);
        font-weight: 450;
        pointer-events: none;
        user-select: none;
        transform: translateY(-100%);
        padding-bottom: calc(0.8 * var(--g-gap-1));
        transition: transform 150ms, padding 150ms 50ms, font-size 150ms, color 150ms;
    }
}
</style>