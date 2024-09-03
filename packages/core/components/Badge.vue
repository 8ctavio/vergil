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
    icon: String,
    iconLeft: String,
    iconRight: String,
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
            `spacing-${spacing}`,
            { squared }
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

/*------------------------------------------------
-------------------- VARIANTS --------------------
------------------------------------------------*/
/*-------- SOFT --------*/
.badge.soft{
    background-color: var(--c-theme-soft-2);
    color: var(--c-theme-text-2);
    &::selection{
        background-color: var(--c-theme-soft-4);
    }
    & > .icon{
        color: var(--c-theme-icon-2);
    }
}

/*-------- OUTLINE --------*/
.badge.outline{
    --btn-bw: 1px;
    --btn-bw-b: 1px;
    --btn-bc: var(--c-theme-border-subtle-4);
    --btn-bc-b: var(--c-theme-border-subtle-4);

    background-color: var(--c-theme-soft-1);
    color: var(--c-theme-text-2);
    box-shadow: inset 0 calc(var(--btn-bw-b) * -1) var(--btn-bc-b),
                inset 0 var(--btn-bw) var(--btn-bc),
                inset var(--btn-bw) 0 var(--btn-bc),
                inset calc(var(--btn-bw) * -1) 0 var(--btn-bc);
    
    &::selection{
        background-color: var(--c-theme-soft-3);
    }
    & > .icon{
        color: var(--c-theme-icon);
    }
}

/*-------- SOLID --------*/
.badge.solid{
    background-color: var(--c-theme-solid-1);
    color: var(--c-theme-text-5);
    &::selection{
        background-color: var(--c-theme-solid-3);
    }
    & > .icon{
        color: var(--c-theme-icon-1);
    }
}
</style>