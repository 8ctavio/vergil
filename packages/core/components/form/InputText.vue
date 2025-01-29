<script setup>
import Btn from '../buttons/Btn.vue'
import Icon from '../Icon.vue'
import FormField from '../private/FormField.vue'
import MiniMarkup from "../private/MiniMarkup"
import { computed } from 'vue'
import { vergil } from '../../vergil'
import { useModelWrapper } from '../../composables'
import { isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
const props = defineProps({
    //----- Model -----
    value: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Object],
        default: props => props.value
    },
    ['onUpdate:modelValue']: Function,

    placeholder: {
        type: String,
        default: ''
    },
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
    underline: {
        type: Boolean,
        default: () => vergil.config.inputText.underline
    },
    disabled: Boolean,
    class: [String, Object],
    
    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,
    floatLabel: Boolean,

    //----- Global -----
    descendant: Boolean,
    theme: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.inputText.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.inputText.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.inputText.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.inputText.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})

const model = useModelWrapper(props)
model.onExternalUpdate(modelValue => {
    model.el.value = modelValue
}, { onMounted: true })
const handleInput = model.updateDecorator(event => {
    model.value = event.target.value
})

const floatLabelEnabled = computed(() => {
    return props.floatLabel
        && Boolean(props.label)
        && !(props.placeholder || props.description || props.icon || props.iconLeft || props.prefix)
})
const showBtnBefore = typeof props.btnBefore === 'object' && props.btnBefore !== null
const showBtnAfter = typeof props.btnAfter === 'object' && props.btnBefore !== null
</script>

<template>
    <FormField :class="['input-text', props.class]"
        :label :hint :description :help :float-label="floatLabelEnabled"
        :theme :size :radius :spacing
    >
        <div class="input-text-outer">
            <Btn v-if="showBtnBefore" v-bind="btnBefore" descendant :disabled="disabled || btnBefore.disabled"/>
            <div :class="['input-text-wrapper', { underline }]">
                <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
                <p v-if="prefix">{{ prefix }}</p>
                <input
                    v-bind="$attrs"
                    :ref="model.refs.el"
                    :class="`text-${textAlign}`"
                    :type
                    :placeholder
                    :maxlength="max"
                    :disabled
                    @input="handleInput"
                >
                <label v-if="floatLabelEnabled">
                    <MiniMarkup :str="label"/>
                </label>
                <p v-if="suffix">{{ suffix }}</p>
                <Icon v-if="iconRight" :code="iconRight"/>
            </div>
            <Btn v-if="showBtnAfter" v-bind="btnAfter" descendant :disabled="disabled || btnAfter.disabled"/>
        </div>
    </FormField>
</template>

<style>
.input-text-outer {
    font-size: 1em;
    display: grid;
    grid-auto-flow: column;
    width: 100%;

    &:has(> .btn:first-child) > .input-text-wrapper {
        --text-input-bw-l: 0px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    &:has(> .btn:last-child) > .input-text-wrapper {
        --text-input-bw-r: 0px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    & > .btn {
        &:first-child {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        &:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
}
.input-text-wrapper {
    --text-input-bw-l: 0.8px;
    --text-input-bw-r: 0.8px;
    --text-input-bw-b: 0.8px;
    --text-input-bc: var(--c-grey-border-subtle);
    --text-input-bc-b: var(--c-grey-border-subtle);

    font-size: 1em;
    position: relative;
    display: flex;
    align-items: center;
    column-gap: var(--g-gap-md);
    padding: 0 var(--g-gap-2xl);
    width: 100%;
    border-radius: var(--g-radius-full, var(--g-radius-md));
    background-color: var(--c-bg);
    color: var(--c-text);
    box-shadow: inset 0 calc(var(--text-input-bw-b) * -1) var(--text-input-bc-b),
                inset 0 0.8px var(--text-input-bc),
                inset var(--text-input-bw-l) 0 var(--text-input-bc),
                inset calc(var(--text-input-bw-r) * -1) 0 var(--text-input-bc);
    outline: 0 solid transparent;
    z-index: 1;
    transition: background-color 150ms, box-shadow 150ms;

    &:has(input:focus-visible){
        outline: 2px solid var(--c-theme-outline);
    }
    &:has(input:disabled){
        --text-input-bc: var(--c-disabled-border-2);
        --text-input-bc-b: var(--c-disabled-border-3);
        color: var(--c-disabled-text);
        background-color: var(--c-disabled-1);
        & > input{
            cursor: not-allowed;
        }
    }
    &.underline {
        --text-input-bw-b: var(--component-border-bottom-width);
        --text-input-bc-b: var(--c-theme-solid-1);
    }

    & > input {
        font-size: 1em;
        font-family: var(--font-sans);
        width: 100%;
        padding: var(--g-gap-md) 0;
        outline: 0 solid transparent;
        &.text-left{ text-align: left; }
        &.text-center{ text-align: center; }
        &.text-right{ text-align: right; }
        &::placeholder {
            color: var(--c-grey-1);
        }
        &:placeholder-shown:not(:focus) + label {
            font-size: 1em;
            padding: var(--g-gap-md) var(--g-gap-2xl);
            transform: translateY(0);
            color: var(--c-grey-1);
            font-weight: 400;
            transition: transform 150ms 50ms, padding 150ms, font-size 150ms 50ms, color 150ms 50ms;
        }
    }
    & > label {
        font-size: 0.9em;
        position: absolute;
        top: 0;
        left: 0;
        color: var(--c-text);
        font-weight: 450;
        pointer-events: none;
        user-select: none;
        transform: translateY(-100%);
        padding-bottom: var(--g-gap-sm);
        transition: transform 150ms, padding 150ms 50ms, font-size 150ms, color 150ms;
    }
    & > p {
        font-size: 0.9em;
        color: var(--c-grey-text-1);
    }
    & > .icon {
        font-size: calc(1em * var(--font-size-scale-icon));
        line-height: var(--line-height-icon);
        color: var(--c-theme-1);
    }
}
</style>