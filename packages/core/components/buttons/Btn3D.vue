<script setup>
import Icon from '../Icon.vue'
import { vergil } from '../../vergil'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '../../utilities/private'

defineProps({
    label: String,
    variant: {
        type: String,
        default: () => vergil.config.btn3D.variant,
        validator: v => isValidVariant('Btn3D', v)
    },
    bordered: {
        type: Boolean,
        default: () => vergil.config.btn3D.bordered
    },
    theme: {
        type: String,
        default: () => vergil.config.btn3D.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.btn3D.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.btn3D.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default:  () => vergil.config.btn3D.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    squared: {
        type: Boolean,
        default: props => vergil.config.btn3D.squared || Boolean(!props.label && props.icon)
    },
    icon: String,
    iconLeft: String,
    iconRight: String,
    disabled: Boolean,
    loading: Boolean
})
</script>

<template>
    <button
        :class="[
            'btn3D',
            variant,
            inferTheme(theme),
            `size-${size}`,
            `radius-${radius}`,
            `spacing-${spacing}`,
            {
                bordered,
                squared,
                loading,
            }
        ]"
        :disabled="disabled || loading"
    >
        <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
        <slot>{{ label }}</slot>
        <Icon v-if="iconRight" :code="iconRight"/>
        <div v-if="loading" class="btn-loader">
            <span class="btn-spinner"></span>
        </div>
    </button>
</template>

<style>
.btn3D{
    --btn3D-c-shadow: rgb(0 0 0 / 0.15);

    /*-------- BOX-SHADOW --------*/
    --btn3D-elv: 5px;
    --btn3D-elv-hover: 3px;
    --btn3D-elv-dif: calc(var(--btn3D-elv) - var(--btn3D-elv-hover));
    --btn3D-border: var(--btn3D-elv);

    --btn3D-shadow-x: 5px;
    --btn3D-shadow-y: calc(var(--btn3D-border) + var(--btn3D-shadow-x));
    --btn3D-outline-width: 2px;
    --btn3D-outline-offset: 3px;
    --btn3D-outline-span: calc(var(--btn3D-outline-width) + var(--btn3D-outline-offset));

    --btn3D-shadow-1: 0 var(--btn3D-border) var(--btn3D-c-border);
    --btn3D-shadow-2: var(--btn3D-shadow-x) var(--btn3D-shadow-y) 1px var(--btn3D-c-shadow);
    --btn3D-shadow-outline: 0px 0px 0px var(--btn3D-outline-offset) var(--c-bg-alt),
                            0px var(--btn3D-elv-hover) 0px var(--btn3D-outline-offset) var(--c-bg-alt),
                            0px 0px 0px var(--btn3D-outline-span) var(--c-theme-outline),
                            0px var(--btn3D-elv-hover) 0px var(--btn3D-outline-span) var(--c-theme-outline);

    font-size: var(--g-font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-md) var(--g-gap-lg);
    border-radius: var(--g-radius);
    column-gap: var(--g-gap-md);

    position: relative;
    display: grid;
    grid-auto-flow: column;
    box-sizing: border-box;
    
    border: none;
    font-weight: 500;
    box-shadow: var(--btn3D-shadow-1), var(--btn3D-shadow-2);
    cursor: pointer;
    transition: box-shadow 150ms, transform 150ms;

    &.squared{
        padding: var(--g-gap-md);
    }

    &:is(:hover, :focus-visible){
        --btn3D-border: var(--btn3D-elv-hover);
        --btn3D-shadow-x: 3px;
        transform: translateY(var(--btn3D-elv-dif));
    }
    &:focus-visible{
        outline: none;
        box-shadow: var(--btn3D-shadow-1), var(--btn3D-shadow-outline);
    }
    &:where(.size-sm.spacing-compact) {
        --btn3D-elv: 4px;
        --btn3D-elv-hover: 3px;
        --btn3D-shadow-x: 4px;
        &:is(:hover, :focus-visible){
            --btn3D-shadow-x: 2px;
        }
    }
    &:where(.size-xl) {
        --btn3D-elv: 6px;
        --btn3D-elv-hover: 4px;
        --btn3D-shadow-x: 6px;
        &:is(:hover, :focus-visible){
            --btn3D-shadow-x: 4px;
        }
    }
    &:active{
        --btn3D-elv-hover: 0px;
        --btn3D-shadow-x: 0px;
        --btn3D-shadow-y: 0px;
        transform: translateY(var(--btn3D-elv));
        transition: box-shadow 100ms, transform 100ms;
    }

    &:disabled:not(.loading){
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);
        box-shadow: 0 var(--btn3D-elv) var(--c-disabled-border-2);
        cursor: not-allowed;
        transform: translateY(0);
    }
    &.loading{
        box-shadow: 0 var(--btn3D-elv) var(--btn3D-c-border);
        cursor: progress;
        transform: translateY(0);
    }

    &::selection{
        background-color: transparent;
    }

    & > .icon{
        align-self: stretch;
        font-size: calc(1em * var(--font-size-scale-icon));
        line-height: var(--line-height-icon);
        aspect-ratio: 1 / 1;
        transition: color 150ms;
    }

    & > .btn-loader{
        font-size: 1em;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        writing-mode: vertical-lr;
        padding: inherit;
        border-radius: inherit;
        background-color: inherit;

        & > .btn-spinner{
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
    &:where(.solid) .btn-spinner{
        border-color: rgb(255 255 255 / 0.95);
        border-top-color: rgb(0 0 0 / 0.45);
    }
    &:where(.soft, .plain) .btn-spinner{
        border-color: var(--c-theme-border-subtle);
        border-top-color: var(--c-theme-text-3);
    }
}
.dark .btn3D{
    --btn3D-c-shadow: rgb(0 0 0 / 0.4);
}

/*------------------------------------------------
-------------------- VARIANTS --------------------
------------------------------------------------*/
/*-------- SOLID --------*/
.btn3D.solid{
    --btn3D-c-border: var(--c-theme-border-3);
    background-color: var(--c-theme-solid-1);
    color: var(--c-theme-text-5);

    &:not(:disabled) > .icon{
        color: var(--c-theme-text-4);
    }
}

/*-------- SOFT --------*/
.btn3D.soft{
    --btn3D-c-border: var(--c-theme-border-1);
    background-color: var(--c-theme-soft-3);
    color: var(--c-theme-text-3);

    &:not(:disabled) > .icon{
        color: var(--c-theme-text-2);
    }
}

/*-------- PLAIN --------*/
.btn3D.plain{
    --btn3D-c-border: var(--c-theme-border-2);
    background-color: var(--c-grey-soft-1);
    color: var(--c-grey-text-10);

    &.bordered{
        border: 1px solid var(--c-theme-solid-1);
    }
    &:disabled:not(.loading){
        background-color: var(--c-disabled-2);
        border-color: var(--c-disabled-border-1);
    }
    &.loading{
        background-color: var(--c-theme-soft-1);
    }
    &:not(:disabled) > .icon{
        color: var(--c-theme-text-1);
    }
}
.dark .btn3D.plain{
    --btn3D-c-border: var(--c-theme-solid-3);
    &:where(.bordered){
        border-color: var(--c-theme-solid-3);
    }
}
</style>