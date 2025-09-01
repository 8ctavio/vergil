<script setup lang="ts">
import { vergil } from '#vergil'
import { Icon, MiniMarkup } from '#components'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '#utilities'
import type { PropType } from 'vue'
import type { BtnVariant, BtnOutline, Theme, Size, Radius, Spacing } from '#types'

defineProps({
    label: String,
    variant: {
        type: String as PropType<BtnVariant>,
        default: () => vergil.config.btn3D.variant,
        validator: (v: string) => isValidVariant('Btn', v)
    },
    outline: {
        type: [Boolean, String] as PropType<boolean | BtnOutline>,
        default: (props: { variant: 'soft' | 'subtle' }) => vergil.config.btn3D[props.variant]?.outline,
        validator: (v: boolean | string) => (typeof v === 'boolean') || ['regular', 'subtle', 'strong'].includes(v)
    },
    icon: String,
    iconLeft: String,
    iconRight: String,
    squared: {
        type: Boolean,
        default: (props: Record<string, string>) => vergil.config.btn3D.squared || Boolean(!props.label && props.icon)
    },
    disabled: Boolean,
    loading: Boolean,

    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.btn3D.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.btn3D.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.btn3D.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default:  (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.btn3D.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})
</script>

<template>
    <button
        :class="['btn3D', variant, {
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
.btn3D {
    --btn3D-c-shadow: light-dark(rgb(0 0 0 / 0.15), rgb(0 0 0 / 0.25));

    /*-------- BOX-SHADOW --------*/
    --btn3D-elv: 5px;
    --btn3D-elv-hover: 3px;
    --btn3D-elv-dif: calc(var(--btn3D-elv) - var(--btn3D-elv-hover));
    --btn3D-front: var(--btn3D-elv);

    --btn3D-shadow-x: 5px;
    --btn3D-shadow-y: calc(var(--btn3D-front) + var(--btn3D-shadow-x));
    --btn3D-outline-width: 2px;
    --btn3D-outline-offset: 3px;
    --btn3D-outline-span: calc(var(--btn3D-outline-width) + var(--btn3D-outline-offset));

    --btn3D-shadow-border: inset 0 0 0 var(--btn3D-bw, 0px) var(--btn3D-c-border, transparent);
    --btn3D-shadow-1: var(--btn3D-shadow-border), 0 var(--btn3D-front) var(--btn3D-c-front);
    --btn3D-shadow-2: var(--btn3D-shadow-x) var(--btn3D-shadow-y) 1px var(--btn3D-c-shadow);
    --btn3D-shadow-outline: 0px 0px 0px var(--btn3D-outline-offset) var(--c-bg-alt),
                            0px var(--btn3D-elv-hover) 0px var(--btn3D-outline-offset) var(--c-bg-alt),
                            0px 0px 0px var(--btn3D-outline-span) var(--c-theme-outline),
                            0px var(--btn3D-elv-hover) 0px var(--btn3D-outline-span) var(--c-theme-outline);

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
    box-shadow: var(--btn3D-shadow-1), var(--btn3D-shadow-2);
    transition: box-shadow 150ms, transform 150ms;

    &::selection {
        background-color: transparent;
    }
    &:is(:hover, :focus-visible) {
        --btn3D-front: var(--btn3D-elv-hover);
        --btn3D-shadow-x: 3px;
        transform: translateY(var(--btn3D-elv-dif));
    }
    &:focus-visible {
        outline: none;
        box-shadow: var(--btn3D-shadow-1), var(--btn3D-shadow-outline);
    }
    &:active:not(.loading) {
        --btn3D-elv-hover: 0px;
        --btn3D-shadow-x: 0px;
        --btn3D-shadow-y: 0px;
        transform: translateY(var(--btn3D-elv));
        transition: box-shadow 100ms, transform 100ms;
    }
    &:disabled:not(.loading) {
        color: var(--c-disabled-text);
        cursor: not-allowed;
        transform: translateY(0);

        &.solid {
            background-color: var(--c-disabled-2);
            box-shadow: 0 var(--btn3D-elv) var(--c-disabled-border-3);
        }
        &.soft {
            background-color: var(--c-disabled-1);
            box-shadow: var(--btn3D-shadow-border), 0 var(--btn3D-elv) var(--c-disabled-border-2);
        }
        &.subtle {
            background-color: var(--c-disabled-1);
            box-shadow: var(--btn3D-shadow-border), 0 var(--btn3D-elv) var(--c-disabled-border-3);
        }
        &.outline-subtle {
            --btn3D-c-border: var(--c-disabled-border-1);
        }
        &.outline-regular {
            --btn3D-c-border: var(--c-disabled-border-2);
        }
        &.outline-strong {
            --btn3D-c-border: var(--c-disabled-border-3);
        }
    }
    &.loading {
        box-shadow: 0 var(--btn3D-elv) var(--btn3D-c-front);
        cursor: progress;
        transform: translateY(0);
    }

    &.solid {
        --btn3D-c-front: var(--c-theme-3);
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
        --btn3D-c-front: var(--c-theme-2);
        background-color: var(--c-theme-soft-2);
    }
    &.subtle {
        --btn3D-c-front: var(--c-theme-solid-1);
        background-color: var(--c-theme-soft-1);
    }
    &:is(.soft, .subtle) {
        color: var(--c-theme-text-2);
        &.outline {
            --btn3D-bw: 0.8px;
        }
        &.outline-subtle {
            --btn3D-c-border: var(--c-theme-border-subtle);
        }
        &.outline-regular {
            --btn3D-c-border: var(--c-theme-border-regular);
        }
        &.outline-strong {
            --btn3D-c-border: var(--c-theme-1);
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

.btn3D:where(.size-sm.spacing-compact, .size-xs),
:where(.size-sm.spacing-compact, .size-xs) .btn3D {
    --btn3D-elv: 4px;
    --btn3D-elv-hover: 3px;
    --btn3D-shadow-x: 3.5px;
    &:is(:hover, :focus-visible) {
        --btn3D-shadow-x: 2px;
    }
}
.btn3D:where(.size-xl),
:where(.size-xl) .btn3D {
    --btn3D-elv: 6px;
    --btn3D-elv-hover: 4px;
    --btn3D-shadow-x: 6px;
    &:is(:hover, :focus-visible) {
        --btn3D-shadow-x: 4px;
    }
}
</style>