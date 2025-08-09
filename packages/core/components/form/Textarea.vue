<script setup lang="ts">
import FormField from '../internal/FormField.vue'
import MiniMarkup from "../internal/MiniMarkup"
import { computed } from 'vue'
import { vergil } from '#vergil'
import { useDefineModel, useDefineElements } from '#composables'
import { isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '#utilities'
import type { PropType } from 'vue'
import type { ModelValueProp, ModelValidatorProp, Elements, Theme, Size, Radius, Spacing } from '../../types'

defineOptions({ inheritAttrs: false })
const props = defineProps({
    //----- Model -----
    value: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Object] as ModelValueProp<string>,
        default: (props: { value: string }) => props.value
    },
    ['onUpdate:modelValue']: Function,
    validator: Function as ModelValidatorProp<string>,
    eagerValidation: Boolean,
    elements: Object as PropType<Elements>,

    placeholder: {
        type: String,
        default: ''
    },
    max: String,
    textAlign: {
        type: String as PropType<'left' | 'center' | 'right'>,
        default: 'left',
        validator: (v: string) => ['left', 'center', 'right'].includes(v),
    },
    rows: String,
    resize: Boolean,
    underline: {
        type: Boolean,
        default: () => vergil.config.textarea.underline
    },
    disabled: Boolean,
    class: [String, Object],
    
    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,
    showErrors: Boolean,
    floatLabel: Boolean,

    //----- Debounced validation -----
    validationDelay: {
        type: Number,
        default: () => vergil.config.textarea.validationDelay ?? vergil.config.global.validationDelay,
    },

    //----- Global -----
    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.textarea.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.textarea.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.textarea.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.textarea.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})

const model = useDefineModel<string>()
const elements = useDefineElements(['input'])

model.onExternalUpdate((modelValue) => {
    (elements.input as HTMLInputElement).value = modelValue
}, { onMounted: true })

const validateInput = model.useDebouncedValidation(props.validationDelay)
const handleInput = model.updateDecorator((event: Event) => {
    model.value = (event.target as HTMLInputElement).value
    validateInput(props.eagerValidation)
})

const floatLabelEnabled = computed(() => {
    return props.floatLabel
        && Boolean(props.label)
        && !(props.placeholder || props.description)
})
</script>

<template>
    <FormField :class="['textarea', props.class]"
        :label :hint :description :help :float-label="floatLabelEnabled"
        :theme :size :radius :spacing
        :showErrors :errors="model.errors"
    >
        <div :class="['textarea-wrapper', { underline, invalid: model.error }]">
            <textarea
                v-bind="$attrs"
                :ref="elements.getRef('input')"
                :class="[`text-${textAlign}`, { resize }]"
                :placeholder
                :maxlength="max"
                :rows
                :disabled
                @input="handleInput"
            />
            <label v-if="floatLabelEnabled">
                <MiniMarkup :str="label"/>
            </label>
        </div>
    </FormField>
</template>

<style>
.textarea-wrapper {
    --textarea-bw: 0.8px;
    --textarea-bw-b: var(--textarea-bw);
    --textarea-bc: var(--c-grey-border-subtle);
    --textarea-bc-b: var(--c-grey-border-subtle);

    font-size: 1em;
    position: relative;
    display: flex;
    align-items: center;
    column-gap: var(--g-gap-md);
    width: 100%;
    border-radius: var(--g-radius-md);
    background-color: var(--c-bg);
    color: var(--c-text);
    box-shadow: inset 0 calc(var(--textarea-bw-b) * -1) var(--textarea-bc-b),
                inset 0 var(--textarea-bw) var(--textarea-bc),
                inset var(--textarea-bw) 0 var(--textarea-bc),
                inset calc(-1 * var(--textarea-bw)) 0 var(--textarea-bc);
    outline: 0 solid transparent;
    transition: background-color 150ms, box-shadow 150ms;

    &:has(textarea:focus-visible) {
        outline: 2px solid var(--c-theme-outline);
    }
    &:has(textarea:disabled) {
        --textarea-bc: var(--c-disabled-border-2);
        --textarea-bc-b: var(--c-disabled-border-2);
        color: var(--c-disabled-text);
        background-color: var(--c-disabled-1);
        &.underline {
            --textarea-bc-b: var(--c-disabled-border-3);
        }
        & > textarea{
            cursor: not-allowed;
        }
    }
    &.invalid {
        --textarea-bw: 1px;
        --textarea-bc: var(--c-theme-solid-1);
        --textarea-bc-b: var(--c-theme-solid-1);
    }
    &.underline {
        --textarea-bw-b: var(--component-border-bottom-width);
        --textarea-bc-b: var(--c-theme-solid-1);
    }

    & > textarea {
        font-size: 1em;
        font-family: var(--font-sans);
        width: 100%;
        padding: var(--g-gap-md) var(--g-gap-2xl);
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
            padding: var(--g-gap-md) var(--g-gap-2xl);
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
        padding-bottom: var(--g-gap-sm);
        transition: transform 150ms, padding 150ms 50ms, font-size 150ms, color 150ms;
    }
}
</style>