<script setup lang="ts">
import { vergil } from '#vergil'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '#utilities'
import Icon from '#components/Icon'
import MiniMarkup from '#components/.internal/MiniMarkup'
import type { PropType } from 'vue'
import type { BtnVariant, BtnOutline } from '#components'
import type { Theme, Size, Radius, Spacing } from '#utilities'

defineProps({
    label: String,
    variant: {
        type: String as PropType<BtnVariant>,
        default: () => vergil.config.pushButton.variant,
        validator: (v: string) => isValidVariant('Btn', v)
    },
    outline: {
        type: [Boolean, String] as PropType<boolean | BtnOutline>,
        default: (props: { variant: 'soft' | 'subtle' }) => vergil.config.pushButton[props.variant]?.outline,
        validator: (v: boolean | string) => (typeof v === 'boolean') || ['regular', 'subtle', 'strong'].includes(v)
    },
    icon: String,
    iconLeft: String,
    iconRight: String,
    squared: {
        type: Boolean,
        default: (props: Record<string, string>) => vergil.config.pushButton.squared || Boolean(!props.label && props.icon)
    },
    disabled: Boolean,
    loading: Boolean,

    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.pushButton.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.pushButton.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.pushButton.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default:  (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.pushButton.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})
</script>

<template>
    <button
        :class="['push-button', variant, {
            outline,
            squared,
            loading,
            [inferTheme(theme)]: theme,
            [`size-${size}`]: size,
            [`radius-${radius}`]: radius,
            [`spacing-${spacing}`]: spacing,
            [`outline-${outline === true ? 'regular' : outline}`]: outline,
        }]"
        :disabled="disabled || loading"
    >
        <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
        <slot>
            <MiniMarkup :str="label"/>
        </slot>
        <Icon v-if="iconRight" :code="iconRight"/>
        <div v-if="loading" class="btn-loader">
            <span class="btn-spinner"></span>
        </div>
    </button>
</template>

<style>
.push-button {
    --push-button-c-shadow: light-dark(rgb(0 0 0 / 0.15), rgb(0 0 0 / 0.25));

    /*-------- BOX-SHADOW --------*/
    --push-button-elv: 5px;
    --push-button-elv-hover: 3px;
    --push-button-elv-dif: calc(var(--push-button-elv) - var(--push-button-elv-hover));
    --push-button-front: var(--push-button-elv);

    --push-button-shadow-x: 5px;
    --push-button-shadow-y: calc(var(--push-button-front) + var(--push-button-shadow-x));
    --push-button-outline-width: 2px;
    --push-button-outline-offset: 3px;
    --push-button-outline-span: calc(var(--push-button-outline-width) + var(--push-button-outline-offset));

    --push-button-shadow-border: inset 0 0 0 var(--push-button-bw, 0px) var(--push-button-c-border, transparent);
    --push-button-shadow-1: var(--push-button-shadow-border), 0 var(--push-button-front) var(--push-button-c-front);
    --push-button-shadow-2: var(--push-button-shadow-x) var(--push-button-shadow-y) 1px var(--push-button-c-shadow);
    --push-button-shadow-outline: 0px 0px 0px var(--push-button-outline-offset) var(--c-bg-alt),
                            0px var(--push-button-elv-hover) 0px var(--push-button-outline-offset) var(--c-bg-alt),
                            0px 0px 0px var(--push-button-outline-span) var(--c-theme-outline),
                            0px var(--push-button-elv-hover) 0px var(--push-button-outline-span) var(--c-theme-outline);

    font-size: var(--font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-md) var(--g-gap-2xl);
    border-radius: var(--g-radius-full, var(--g-radius-md));
    column-gap: var(--g-gap-md);

    position: relative;
    display: grid;
    grid-auto-flow: column;
    box-sizing: border-box;
    
    border: none;
    font-weight: 500;
    box-shadow: var(--push-button-shadow-1), var(--push-button-shadow-2);
    transition: box-shadow 150ms, transform 150ms;

    &::selection {
        background-color: transparent;
    }
    &:is(:hover, :focus-visible):not(:disabled) {
        --push-button-front: var(--push-button-elv-hover);
        --push-button-shadow-x: 3px;
        transform: translateY(var(--push-button-elv-dif));
    }
    &:focus-visible {
        outline: none;
        box-shadow: var(--push-button-shadow-1), var(--push-button-shadow-outline);
    }
    &:active:not(.loading) {
        --push-button-elv-hover: 0px;
        --push-button-shadow-x: 0px;
        --push-button-shadow-y: 0px;
        transform: translateY(var(--push-button-elv));
        transition: box-shadow 100ms, transform 100ms;
    }
    &:disabled:not(.loading) {
        color: var(--c-disabled-text);
        cursor: not-allowed;
        transform: translateY(0);

        &.solid {
            background-color: var(--c-disabled-2);
            --push-button-c-front: var(--c-disabled-border-3);
        }
        &.soft {
            background-color: var(--c-disabled-1);
            --push-button-c-front: var(--c-disabled-border-2);
        }
        &.subtle {
            background-color: var(--c-disabled-1);
            --push-button-c-front: var(--c-disabled-border-3);
        }
        &.outline-subtle {
            --push-button-c-border: var(--c-disabled-border-1);
        }
        &.outline-regular {
            --push-button-c-border: var(--c-disabled-border-2);
        }
        &.outline-strong {
            --push-button-c-border: var(--c-disabled-border-3);
        }
    }
    &.loading {
        cursor: progress;
        transform: translateY(0);
    }

    &.solid {
        --push-button-c-front: var(--c-theme-3);
        background-color: var(--c-theme-solid-1);
        color: var(--c-theme-text-4);

        &:not(:disabled) > .icon {
            color: var(--c-theme-text-3);
        }
        & .btn-spinner {
            border-color: rgb(255 255 255 / 0.95);
            border-top-color: rgb(0 0 0 / 0.45);
        }
    }
    &.soft {
        --push-button-c-front: var(--c-theme-2);
        background-color: var(--c-theme-soft-2);
    }
    &.subtle {
        --push-button-c-front: var(--c-theme-solid-1);
        background-color: var(--c-theme-soft-1);
    }
    &:is(.soft, .subtle) {
        color: var(--c-theme-text-2);
        &.outline {
            --push-button-bw: 0.8px;
        }
        &.outline-subtle {
            --push-button-c-border: var(--c-theme-border-subtle);
        }
        &.outline-regular {
            --push-button-c-border: var(--c-theme-border-regular);
        }
        &.outline-strong {
            --push-button-c-border: var(--c-theme-1);
        }
        & .btn-spinner {
            border-color: var(--c-theme-border-subtle);
            border-top-color: var(--c-theme-text-2);
        }
    }
    &.squared {
        padding: var(--g-gap-md);
    }

    & > .icon {
        align-self: stretch;
        font-size: calc(1em * var(--font-size-scale-icon));
        line-height: var(--line-height-icon);
        aspect-ratio: 1 / 1;
        transition: color 150ms;
    }
    & > .btn-loader {
        font-size: 1em;
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        writing-mode: vertical-lr;
        padding: inherit;
        border-radius: inherit;
        background-color: inherit;

        & > .btn-spinner {
            font-size: 1em;
            height: 100%;
            margin: calc((100% - (1em * var(--font-size-scale-icon))) / 2) 0;
            aspect-ratio: 1 / 1;
            border-width: 3px;
            border-style: solid;
            border-top-width: 3px;
            border-top-style: solid;
            border-radius: 50%;
            animation: spin 1000ms linear infinite;
        }
    }
}

.push-button:where(.size-sm.spacing-compact, .size-xs),
:where(.size-sm.spacing-compact, .size-xs) .push-button {
    --push-button-elv: 4px;
    --push-button-elv-hover: 3px;
    --push-button-shadow-x: 3.5px;
    &:is(:hover, :focus-visible):not(:disabled) {
        --push-button-shadow-x: 2px;
    }
}
.push-button:where(.size-xl),
:where(.size-xl) .push-button {
    --push-button-elv: 6px;
    --push-button-elv-hover: 4px;
    --push-button-shadow-x: 6px;
    &:is(:hover, :focus-visible):not(:disabled) {
        --push-button-shadow-x: 4px;
    }
}
</style>