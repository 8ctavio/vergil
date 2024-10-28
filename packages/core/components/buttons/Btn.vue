<script setup>
import Icon from '../Icon.vue'
import MiniMarkup from '../private/MiniMarkup'
import { vergil } from '../../vergil'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../../utilities/private'

defineProps({
    label: String,
    variant: {
        type: String,
        default: () => vergil.config.btn.variant,
        validator: v => isValidVariant('Btn', v)
    },
    ghost: {
        type: [Boolean, String],
        default: props => vergil.config.btn[props.variant]?.ghost,
        validator: v => (typeof v === 'boolean') || ['transparent', 'translucent'].includes(v)
    },
    outline: {
        type: [Boolean, String],
        default: props => vergil.config.btn[props.variant]?.outline,
        validator: v => (typeof v === 'boolean') || ['regular', 'subtle', 'strong'].includes(v)
    },
    underline: {
        type: Boolean,
        default: props => vergil.config.btn[props.variant]?.underline,
    },
    fill: {
        type: Boolean,
        default: props => vergil.config.btn[props.variant]?.fill,
    },
    icon: String,
    iconLeft: String,
    iconRight: String,
    theme: {
        type: String,
        default: () => vergil.config.btn.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.btn.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.btn.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: () => vergil.config.btn.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    squared: {
        type: Boolean,
        default: props => vergil.config.btn.squared || Boolean(!props.label && (props.icon || props.iconLeft || props.iconRight))
    },
    disabled: Boolean,
    loading: Boolean
})
</script>

<template>
    <button
        :class="[
            'btn',
            variant,
            inferTheme(theme),
            `size-${size}`,
            `radius-${radius}`,
            {
                ghost,
                underline,
                fill,
                squared,
                loading,
                [`spacing-${spacing}`]: spacing,
                [`ghost-${ghost === true ? 'transparent' : ghost}`]: ghost,
                [`outline-${outline === true ? 'regular' : outline}`]: outline,
            }
        ]"
        :disabled="disabled || loading"
    >
        <span v-if="ghost" class="btn-backdrop"/>
        <div class="btn-content">
            <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
            <slot>
                <MiniMarkup :str="label"/>
            </slot>
            <Icon v-if="iconRight" :code="iconRight"/>
            <div v-if="loading" class="btn-loader">
                <span class="btn-spinner"/>
            </div>
        </div>
        <slot name="aside"/>
    </button>
</template>

<style>
.btn {
    --btn-c-icon: var(--btn-c-icon-1);
    --btn-c-border: var(--btn-c-border-1);
    --btn-c-border-b: var(--c-theme-solid-1);
    --btn-bw: 0px;
    --btn-bw-b: 0px;

    font-size: var(--g-font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-md) var(--g-gap-lg);
    border-radius: var(--g-radius);
    background-color: var(--btn-c-1);
    color: var(--btn-c-text-1);
    box-shadow: inset 0 calc(var(--btn-bw-b) * -1) var(--btn-c-border-b),
                inset 0 0 0 var(--btn-bw) var(--btn-c-border, transparent);

    position: relative;
    border: none;
    font-weight: 500;
    outline: 0 solid transparent;
    cursor: pointer;
    overflow: hidden;
    transition: background-color 150ms, color 150ms, box-shadow 150ms;

    &:not(.loading) {
        &:is(:hover, :focus-visible, :active) {
            --btn-c-icon: var(--btn-c-icon-2);
            --btn-c-border: var(--btn-c-border-2);
            color: var(--btn-c-text-2);
        }
        &:is(:hover, :focus-visible) {
            &:not(.fill) {
                background-color: var(--btn-c-2);
            }
            &.fill:not(:disabled) > .btn-backdrop {
                height: 100%;
                background-color: var(--btn-c-2);
            }
        }
        &:active {
            &:where(.solid) {
                --btn-c-border-b: transparent;
            }
            &:not(.fill), &.fill:not(:disabled) > .btn-backdrop {
                background-color: var(--btn-c-3);
            }
        }
        &:disabled {
            --btn-c-icon: var(--c-disabled-text);
            --btn-c-border-b: var(--c-disabled-border-3);
            cursor: not-allowed;
            color: var(--c-disabled-text);

            &.subtle {
                --btn-c-border: var(--c-disabled-border-1);
                background-color: var(--c-disabled-1);
            }
            &:is(.solid, .soft) {
                --btn-c-border: var(--c-disabled-border-2);
                background-color: var(--c-disabled-2);
            }
        }

        &.ghost-transparent {
            --btn-c-1: transparent;
            --btn-c-text-1: var(--c-theme-text-1);
            --btn-c-icon-1: var(--c-theme-1);
        }
        &.ghost-translucent {
            --btn-c-1: rgb(var(--rgb-grey-border) / 0.05);
            --btn-c-text-1: var(--c-grey-text-2);
            --btn-c-icon-1: var(--c-grey-1);
        }
    }
    &:focus-visible {
        outline: 2px solid var(--c-theme-outline);
        &:is(.solid, .outline, .underline) {
            outline-offset: 3px;
        }
    }
    &.loading {
        cursor: progress;
        & > .btn-content{
            background-color: inherit;
            & > .btn-loader{
                background-color: inherit;
            }
        }
    }

    &.solid {
        --btn-c-1: var(--c-theme-solid-1);
        --btn-c-2: var(--c-theme-solid-2);
        --btn-c-3: var(--c-theme-solid-3);
        --btn-c-text-1: var(--c-theme-text-4);
        --btn-c-text-2: var(--c-theme-text-4);
        --btn-c-icon-1: var(--c-theme-text-3);
        --btn-c-icon-2: var(--c-theme-text-3);
        &.ghost {
            --btn-c-2: var(--c-theme-solid-1);
            --btn-c-3: var(--c-theme-solid-2);
        }
        & > .btn-content .btn-spinner {
            border-color: rgb(255 255 255 / 0.95);
            border-top-color: rgb(0 0 0 / 0.45);
        }
    }
    &.soft {
        --btn-c-1: var(--c-theme-soft-2);
        --btn-c-2: var(--c-theme-soft-3);
        --btn-c-3: var(--c-theme-soft-4);
        &.ghost {
            --btn-c-2: var(--c-theme-soft-2);
            --btn-c-3: var(--c-theme-soft-3);
        }
    }
    &.subtle {
        --btn-c-1: var(--c-theme-soft-1);
        --btn-c-2: var(--c-theme-soft-2);
        --btn-c-3: var(--c-theme-soft-3);
        &.ghost {
            --btn-c-2: var(--c-theme-soft-1);
            --btn-c-3: var(--c-theme-soft-2);
        }
    }
    &:is(.soft, .subtle) {
        --btn-c-text-1: var(--c-theme-text-2);
        --btn-c-text-2: var(--c-theme-text-2);
        & > .btn-backdrop {
            box-shadow: inherit;
        }
        & .btn-spinner{
            border-color: var(--c-theme-border-subtle);
            border-top-color: var(--c-theme-text-2);
        }
    }

    &:is(.outline-subtle, .outline-regular, .outline-strong) {
        --btn-bw: 0.8px;
    }
    &.outline-subtle {
        --btn-c-border-1: var(--c-theme-border-subtle);
        &:where(.soft, .subtle) {
            --btn-c-border-2: var(--c-theme-border-subtle);
        }
        &:where(.ghost-translucent) {
            --btn-c-border-1: var(--c-grey-border-subtle);
        }
    }
    &.outline-regular {
        --btn-c-border-1: var(--c-theme-border-regular);
        &:where(.soft, .subtle) {
            --btn-c-border-2: var(--c-theme-border-regular);
        }
        &:where(.ghost-translucent) {
            --btn-c-border-1: var(--c-grey-border-regular);
        }
    }
    &.outline-strong {
        --btn-c-border-1: var(--c-theme-1);
        &:where(.soft, .subtle) {
            --btn-c-border-2: var(--c-theme-1);
        }
        &:where(.ghost-translucent) {
            --btn-c-border-1: var(--c-grey-1);
        }
    }
    &.underline {
        --btn-bw-b: var(--component-border-bottom-width);
    }
    &.fill {
        transition: background-color 150ms, color 200ms, box-shadow 150ms;
        & > .btn-content > .icon {
            transition: color 200ms;
        }
    }
    &.squared {
        padding: var(--g-gap-md);
    }

    & > .btn-backdrop{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0;
        background-color: transparent;
        border-radius: inherit;
        transition: height 150ms linear, background-color 150ms ease-in, box-shadow 150ms ease-in;
    }
    & > .btn-content {
        font-size: 1em;
        position: relative;
        display: grid;
        grid-auto-flow: column;
        justify-content: center;
        column-gap: var(--g-gap-md);

        &::selection {
            background-color: transparent;
        }

        & > .icon {
            font-size: calc(1em * var(--font-size-scale-icon));
            line-height: var(--line-height-icon);
            aspect-ratio: 1 / 1;
            color: var(--btn-c-icon, inherit);
            transition: color 150ms;
        }

        & > .btn-loader {
            font-size: 1em;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            writing-mode: vertical-lr;

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
}
</style>