<script setup lang="ts">
import { computed, inject } from 'vue'
import { vergil } from '#vergil'
import { Btn, Icon, FormField, MiniMarkup } from '#components'
import { isObject, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '#utilities'
import type { ShallowRef, PropType } from 'vue'
import type { ModelWrapper, Entangled, Theme, Size, Radius, Spacing } from '#types'

defineOptions({ inheritAttrs: false })
const props = defineProps({
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
    type: {
        type: String as PropType<'text' | 'password'>,
        default: 'text',
        validator: (v: string) => ['text', 'password'].includes(v),
    },
    autoselect: Boolean,
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
	showErrors: Boolean,
    floatLabel: Boolean,

    //----- Global -----
    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.inputText.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.inputText.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.inputText.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.inputText.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})

const model = inject('model') as ModelWrapper<string>
const elements = inject('elements') as Entangled<Record<string, ShallowRef<HTMLElement | null>>>

const floatLabelEnabled = computed(() => {
    return props.floatLabel
        && Boolean(props.label)
        && !(props.placeholder || props.description || props.icon || props.iconLeft || props.prefix)
})
</script>

<template>
    <FormField :class="['input-text', props.class]"
        :label :hint :description :help :float-label="floatLabelEnabled"
        :theme :size :radius :spacing
        :showErrors :errors="model.errors"
    >
        <div class="input-text-outer">
            <Btn v-if="isObject(btnBefore)" v-bind="btnBefore" descendant :disabled="disabled || btnBefore.disabled"/>
            <div :class="['input-text-wrapper', { underline, invalid: model.error }]">
                <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
                <p v-if="prefix">{{ prefix }}</p>
                <input
                    v-bind="$attrs"
                    :ref="elements.getRef('input')"
                    :class="`text-${textAlign}`"
                    :type
                    :placeholder
                    :maxlength="max"
                    :disabled
                    @[autoselect&&'focusin']="(event: FocusEvent) => (event.target as HTMLInputElement).select()"
                >
                <label v-if="floatLabelEnabled">
                    <MiniMarkup :str="label"/>
                </label>
                <p v-if="suffix">{{ suffix }}</p>
                <Icon v-if="iconRight" :code="iconRight"/>
            </div>
            <Btn v-if="isObject(btnAfter)" v-bind="btnAfter" descendant :disabled="disabled || btnAfter.disabled"/>
        </div>
    </FormField>
</template>

<style>
.input-text-outer {
    font-size: 1em;
    display: grid;
    grid-template-columns: auto 1fr auto;
    width: 100%;

    &:has(> .btn:first-child) > .input-text-wrapper {
		margin-left: calc(var(--text-input-bw) * -1);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    &:has(> .btn:last-child) > .input-text-wrapper {
		margin-right: calc(var(--text-input-bw) * -1);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    & > .btn {
        &:first-child {
            z-index: 1;
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
    --text-input-bw: 0.8px;
    --text-input-bc: var(--c-grey-border-subtle);

    font-size: 1em;
    position: relative;
    grid-column-start: 2;
    display: flex;
    align-items: center;
    column-gap: var(--g-gap-md);
    padding: 0 var(--g-gap-2xl);
    border-radius: var(--g-radius-full, var(--g-radius-md));
    background-color: var(--c-bg);
    color: var(--c-text);
    box-shadow: inset 0 calc(var(--text-input-bw-b, 0px) * -1) var(--text-input-bc-b, transparent),
                inset 0 0 0 var(--text-input-bw) var(--text-input-bc, transparent);

    outline: 0 solid transparent;
    transition: background-color 150ms, box-shadow 150ms;

    &:has(input:focus-visible) {
        outline: 2px solid var(--c-theme-outline);
    }
    &:has(input:disabled) {
        --text-input-bc: var(--c-disabled-border-2);
        --text-input-bc-b: var(--c-disabled-border-2);
        color: var(--c-disabled-text);
        background-color: var(--c-disabled-1);
        &.underline {
            --text-input-bc-b: var(--c-disabled-border-3);
        }
        & > input {
            cursor: not-allowed;
        }
    }
    &.invalid {
        --text-input-bw: 1px;
        --text-input-bc: var(--c-theme-solid-1);
        --text-input-bc-b: var(--c-theme-solid-1);
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
        border: none;
        background-color: transparent;
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