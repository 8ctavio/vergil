<script setup lang="ts">
import { vergil } from '#vergil'
import { Icon, MiniMarkup } from '#components'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '#utilities'
import type { PropType } from 'vue'
import type { Theme, Size, Radius, Spacing, BtnVariant } from '../types'

defineProps({
    label: {
        type: String,
        default: ''
    },
    variant: {
        type: String as PropType<BtnVariant>,
        default: () => vergil.config.badge.variant,
        validator: (v: string) => isValidVariant('Btn', v)
    },
    outline: {
        type: [Boolean, String],
        default: (props: { variant: 'soft' | 'subtle' }) => vergil.config.badge[props.variant]?.outline,
        validator: (v: boolean | string) => (typeof v === 'boolean') || ['regular', 'subtle', 'strong'].includes(v)
    },
    icon: String,
    iconLeft: String,
    iconRight: String,
    squared: {
        type: Boolean,
        default: (props: Record<string, string>) => vergil.config.badge.squared || Boolean(!props.label && (props.icon || props.iconLeft || props.iconRight))
    },

    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.badge.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.badge.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.badge.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.badge.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})
</script>

<template>
    <p :class="['badge', variant, {
        outline,
        squared,
        [inferTheme(theme)]: theme,
        [`size-${size}`]: size,
        [`radius-${radius}`]: radius,
        [`spacing-${spacing}`]: spacing,
        [`outline-${outline === true ? 'regular' : outline}`]: outline,
    }]">
        <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
        <slot>
            <MiniMarkup :str="label"/>
        </slot>
        <Icon v-if="iconRight" :code="iconRight"/>
    </p>
</template>

<style>
.badge{
    font-size: var(--font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-md) var(--g-gap-2xl);
    border-radius: var(--g-radius-full, var(--g-radius-md));

    display: grid;
    grid-auto-flow: column;
    column-gap: var(--g-gap-md);
    border: none;
    cursor: default;

    &.solid {
        background-color: var(--c-theme-solid-1);
        color: var(--c-theme-text-4);
        &::selection{
            background-color: var(--c-theme-solid-3);
        }
        & > .icon{
            color: var(--c-theme-text-3);
        }
    }
    &.soft {
        background-color: var(--c-theme-soft-2);
        &::selection{
            background-color: var(--c-theme-soft-4);
        }
    }
    &.subtle {
        background-color: var(--c-theme-soft-1);
        &::selection{
            background-color: var(--c-theme-soft-3);
        }
    }
    &:is(.soft, .subtle) {
        color: var(--c-theme-text-2);
        &.outline {
            box-shadow: inset 0 0 0 0.8px var(--badge-c-outline, transparent);
        }
    }
    &.outline-subtle {
        --badge-c-outline: var(--c-theme-border-subtle);
    }
    &.outline-regular {
        --badge-c-outline: var(--c-theme-border-regular);
    }
    &.outline-strong {
        --badge-c-outline: var(--c-theme-1);
    }
    &.squared{
        padding: var(--g-gap-md);
    }
    & > .icon{
        font-size: calc(1em * var(--font-size-scale-icon));
        line-height: var(--line-height-icon);
        aspect-ratio: 1 / 1;
        text-align: center;
    }
}
</style>