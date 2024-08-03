<script setup>
import Btn from '../buttons/Btn.vue'
import Icon from '../Icon.vue'
import FormField from '../utils/FormField.vue'
import MiniMarkup from "../utils/MiniMarkup.vue"
import { computed, toRef } from 'vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel, isModelWrapper } from '../../utilities'
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
        validator: v => isModel(v) || isModelWrapper(v)
    },

    //----- Component specific -----
    placeholder: String,
    max: String,
    textAlign: {
        type: String,
        default: 'left',
        validator: v => ['left', 'center', 'right'].includes(v),
    },
    type: {
        type: String,
        default: 'text',
        validator(v){
            return ['text', 'password'].includes(v)
        },
    },
    prefix: String,
    suffix: String,
    icon: String,
    iconLeft: String,
    iconRight: String,
    btnBefore: Object,
    btnAfter: Object,

    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,
    floatLabel: Boolean,

    underline: {
        type: Boolean,
        default: () => vergil.config.inputText.underline
    },
    theme: {
        type: String,
        default: () => vergil.config.inputText.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.inputText.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.inputText.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: () => vergil.config.inputText.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    disabled: Boolean,
    class: { default: '' }
})
const classAttr = toRef(() => props.class)

const model = useModel(props.modelValue)

const canLabelFloat = computed(() => Boolean(props.floatLabel && props.label && !(props.description || props.icon || props.iconLeft || props.prefix)))
const showBtnBefore = typeof props.btnBefore === 'object' && props.btnBefore !== null
const showBtnAfter = typeof props.btnAfter === 'object' && props.btnBefore !== null
</script>

<template>
    <FormField class="input-text" :class="classAttr"
        :label :hint :description :help :float-label="canLabelFloat"
        :size :radius :spacing
        >
        <div :class="['input-text-outer', { underline }]">
            <Btn v-if="showBtnBefore" variant="outline" v-bind="btnBefore"
                :theme
                :size
                :radius
                :spacing
                :disabled="disabled || btnBefore.disabled"
                />
            <div :class="['input-text-wrapper', inferTheme(theme)]">
                <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
                <p v-if="prefix">{{ prefix }}</p>
                <input
                    v-bind="$attrs"
                    v-model="model.value"
                    :ref="model.getRef('el')"
                    :class="`text-${textAlign}`"
                    :type
                    :placeholder="canLabelFloat ? '' : placeholder"
                    :maxlength="max"
                    :disabled
                >
                <p v-if="suffix">{{ suffix }}</p>
                <label v-if="canLabelFloat">
                    <MiniMarkup :str="label"/>
                </label>
                <Icon v-if="iconRight" :code="iconRight"/>
            </div>
            <Btn v-if="showBtnAfter" variant="outline" v-bind="btnAfter"
                :theme
                :size
                :radius
                :spacing
                :disabled="disabled || btnAfter.disabled"
                />
        </div>
    </FormField>
</template>

<style>
.input-text-outer{
    display: grid;
    grid-auto-flow: column;
    width: 100%;

    &:has(> .btn:first-child) > .input-text-wrapper{
        --text-input-bw-l: 0px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    &:has(> .btn:last-child) > .input-text-wrapper{
        --text-input-bw-r: 0px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    & > .btn{
        &:first-child{
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        &:last-child{
            grid-column-start: 3;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        &.outline{
            --btn-bw: 0.5px;
            --btn-bw-b: 0.5px;
        }
    }
    &:where(.underline){
        & > .btn.outline{
            --btn-bw-b: 2px;
            --btn-bc-b: var(--c-theme-1);
        }
        & > .input-text-wrapper{
            --text-input-bw-b: 2px;
            --text-input-bc-b: var(--c-theme-1);
        }
    }
}
.input-text-wrapper{
    --text-input-bw-l: 0.5px;
    --text-input-bw-r: 0.5px;
    --text-input-bw-b: 0.5px;
    --text-input-bc: var(--c-grey-border-1);
    --text-input-bc-b: var(--c-grey-border-1);

    font-size: 1em;
    position: relative;
    display: flex;
    align-items: center;
    column-gap: var(--g-gap-1);
    padding: 0 var(--g-gap-2);
    width: 100%;
    border-radius: var(--g-radius);
    background-color: var(--c-bg);
    color: var(--c-text);
    box-shadow: inset 0 calc(var(--text-input-bw-b) * -1) var(--text-input-bc-b),
                inset 0 0.5px var(--text-input-bc),
                inset var(--text-input-bw-l) 0 var(--text-input-bc),
                inset calc(var(--text-input-bw-r) * -1) 0 var(--text-input-bc);
    outline: 0 solid transparent;
    z-index: 1;
    transition: background-color 150ms, box-shadow 150ms;

    &:has(input:focus-visible){
        outline: 2px solid var(--c-theme-outline);
    }
    &:has(input:disabled){
        --text-input-bc: var(--c-disabled-border);
        --text-input-bc-b: var(--c-disabled-border);
        color: var(--c-disabled-text);
        background-color: var(--c-disabled-2);
        & > input{
            cursor: not-allowed;
        }
    }

    & > input{
        font-size: 1em;
        font-family: var(--font-sans);
        width: 100%;
        padding: var(--g-gap-1) 0;
        outline: 0 solid transparent;
        &.text-left{ text-align: left; }
        &.text-center{ text-align: center; }
        &.text-right{ text-align: right; }
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
    & > p{
        font-size: 0.9em;
        color: var(--c-grey-text-3);
    }
    & > .icon{
        font-size: calc(1em * var(--font-size-scale-icon));
        line-height: var(--line-height-icon);
        color: var(--c-theme-icon-3);
    }
}
</style>