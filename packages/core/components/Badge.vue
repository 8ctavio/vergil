<script setup>
import Icon from './Icon.vue'
import MiniMarkup from './utils/MiniMarkup.vue'
import { vergil } from '../vergil'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../utilities/private'

defineProps({
    label: {
        type: String,
        default: ''
    },
    variant: {
        type: String,
        default: () => vergil.config.badge.variant,
        validator: v => isValidVariant('Btn', v)
    },
    outline: {
        type: [Boolean, String],
        default: props => vergil.config.badge[props.variant]?.outline,
        validator: v => (typeof v === 'boolean') || ['regular', 'subtle', 'strong'].includes(v)
    },
    icon: String,
    iconLeft: String,
    iconRight: String,
    theme: {
        type: String,
        default: () => vergil.config.badge.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.badge.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.badge.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: () => vergil.config.badge.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    squared: {
        type: Boolean,
        default: props => vergil.config.badge.squared || Boolean(!props.label && (props.icon || props.iconLeft || props.iconRight))
    },
})
</script>

<template>
    <p
        :class="[
            'badge',
            variant,
            inferTheme(theme),
            `size-${size}`,
            `radius-${radius}`,
            {
                outline,
                squared,
                [`spacing-${spacing}`]: spacing,
                [`outline-${outline === true ? 'regular' : outline}`]: outline,
            }
        ]"
    >
        <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
        <slot>
            <MiniMarkup :str="label"/>
        </slot>
        <Icon v-if="iconRight" :code="iconRight"/>
    </p>
</template>

<style>
.badge{
    font-size: var(--g-font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-md) var(--g-gap-lg);
    border-radius: var(--g-radius);

    display: grid;
    grid-auto-flow: column;
    column-gap: var(--g-gap-md);
    border: none;
    font-weight: 500;
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