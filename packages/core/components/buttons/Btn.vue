<script setup>
import Icon from '../Icon.vue'
import MiniMarkup from '../utils/MiniMarkup.vue'
import { vergil } from '../../vergil'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../../utilities/private'

defineProps({
    label: String,
    variant: {
        type: String,
        default: () => vergil.config.btn.variant,
        validator: v => isValidVariant('Btn', v)
    },
    ghost: Boolean,
    disclose: Boolean,
    outline: {
        type: [Boolean, String],
        validator: v => (typeof v === 'boolean') || ['subtle', 'strong'].includes(v)
    },
    underline: Boolean,
    fill: Boolean,
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
            `spacing-${spacing}`,
            {
                ghost,
                disclose,
                outline,
                'outline-subtle': [true, 'subtle'].includes(outline),
                'outline-strong': outline === 'strong',
                underline,
                fill,
                squared,
                loading,
            }
        ]"
        :disabled="disabled || loading"
    >
        <span v-if="ghost || disclose" class="btn-backdrop"/>
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
    </button>
</template>

<style>
.btn {
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
        &:is(:hover, :focus-visible) {
            color: var(--btn-c-text-2);

            &:not(.fill) {
                background-color: var(--btn-c-2);
            }
            &.fill > .btn-backdrop {
                height: 100%;
                background-color: var(--btn-c-2);
            }
        }
        &:active {
            color: var(--btn-c-text-2);

            &:not(.fill), &.fill > .btn-backdrop {
                background-color: var(--btn-c-3);
            }
        }
        &:disabled {
            cursor: not-allowed;
            color: var(--c-disabled-text);
            --btn-c-border-b: var(--c-disabled-border-3);

            &.subtle {
                background-color: var(--c-disabled-1);
                --btn-c-border: var(--c-disabled-border-1);
            }
            &:is(.solid, .soft) {
                background-color: var(--c-disabled-2);
                --btn-c-border: var(--c-disabled-border-2);
            }
        }
    }
    &:focus-visible {
        outline: 2px solid var(--c-theme-outline);
        &.solid, &.outline, &.underline {
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
        --btn-c-text-1: var(--c-theme-text-5);
        --btn-c-text-2: var(--c-theme-text-5);
        &:is(.ghost, .disclose) {
            --btn-c-2: var(--c-theme-solid-1);
            --btn-c-3: var(--c-theme-solid-2);
        }
        &.outline {
            --btn-c-border: var(--c-theme-border-2);
            &:where(:hover, :focus-visible, :active) {
                --btn-c-border: transparent;
            }
        }
        &.underline:not(.fill):active {
            --btn-c-border-b: transparent;
        }
        & > .btn-content > .icon {
            color: var(--c-theme-text-4);
        }
    }
    &.soft {
        --btn-c-1: var(--c-theme-soft-3);
        --btn-c-2: var(--c-theme-soft-4);
        --btn-c-3: var(--c-theme-soft-5);
        --btn-c-text-1: var(--c-theme-text-3);
        --btn-c-text-2: var(--c-theme-text-3);
        &:is(.ghost, .disclose) {
            --btn-c-2: var(--c-theme-soft-3);
            --btn-c-3: var(--c-theme-soft-4);
        }
    }
    &.subtle {
        --btn-c-1: var(--c-theme-soft-1);
        --btn-c-2: var(--c-theme-soft-2);
        --btn-c-3: var(--c-theme-soft-3);
        --btn-c-text-1: var(--c-theme-text-2);
        --btn-c-text-2: var(--c-theme-text-2);
        &:is(.ghost, .disclose) {
            --btn-c-2: var(--c-theme-soft-1);
            --btn-c-3: var(--c-theme-soft-2);
        }
    }
    &.ghost {
        --btn-c-1: transparent;
        --btn-c-text-1: var(--c-theme-text-1);
    }
    &.disclose {
        --btn-c-1: var(--c-grey-soft-2);
        --btn-c-text-1: var(--c-grey-text-2);
    }
    &.outline {
        --btn-bw: 1px;
    }
    &.outline-subtle {
        --btn-c-border: var(--c-theme-border-subtle);
    }
    &.outline-strong {
        --btn-c-border: var(--c-theme-border-strong);
    }
    &.underline {
        --btn-bw-b: var(--component-border-bottom-width);
    }
    &.fill {
        transition: background-color 150ms, color 200ms, box-shadow 150ms;
    }
    &.squared {
        padding: var(--g-gap-md);
    }

    &:is(.soft, .subtle) > .btn-backdrop {
        box-shadow: inherit;
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
        column-gap: var(--g-gap-md);

        &::selection {
            background-color: transparent;
        }

        & > .icon {
            font-size: calc(1em * var(--font-size-scale-icon));
            line-height: var(--line-height-icon);
            aspect-ratio: 1 / 1;
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
    &.solid .btn-spinner{
        border-color: rgb(255 255 255 / 0.95);
        border-top-color: rgb(0 0 0 / 0.45);
    }
    &.soft .btn-spinner{
        border-color: var(--c-theme-border-subtle);
        border-top-color: var(--c-theme-text-3);
    }
    &.subtle .btn-spinner{
        border-color: var(--c-theme-border-subtle);
        border-top-color: var(--c-theme-text-2);
    }
}
</style>