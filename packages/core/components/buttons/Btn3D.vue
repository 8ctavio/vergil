<script setup>
import Icon from '../Icon.vue'
import { isValidTheme, inferTheme } from '../../functions/utils'

defineProps({
    label: String,
    variant: {
        type: String,
        default: 'solid',
        validator(value, props){
            return ['solid', 'soft', 'outline'].includes(value)
        }
    },
    borderless: Boolean,
    theme: {
        type: String,
        default: 'brand',
        validator: isValidTheme
    },
    size: {
        type: String,
        default: 'md',
        validator(value, props){
            return ['sm', 'md', 'lg', 'xl'].includes(value)
        }
    },
    radius: {
        type: String,
        default: 'md',
        validator(value, props){
            return ['none', 'sm', 'md', 'lg', 'full'].includes(value)
        }
    },
    spacing: {
        type: String,
        default: '',
        validator(value, props){
            return ['', 'compact', 'expanded'].includes(value)
        }
    },
    squared: {
        type: Boolean,
        default(props){
            return Boolean(!props.label && props.icon)
        }
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
            size,
            `radius-${radius}`,
            spacing,
            {
                borderless,
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

    position: relative;
    display: grid;
    box-sizing: border-box;
    grid-auto-flow: column;
    
    border: none;
    box-shadow: var(--btn3D-shadow-1), var(--btn3D-shadow-2);
    font-weight: 500;
    line-height: normal;
    cursor: pointer;
    transition: box-shadow 150ms, transform 150ms;

    &:is(:hover, :focus-visible){
        --btn3D-border: var(--btn3D-elv-hover);
        --btn3D-shadow-x: 3px;
        transform: translateY(var(--btn3D-elv-dif));
    }
    &:focus-visible{
        outline: none;
        box-shadow: var(--btn3D-shadow-1), var(--btn3D-shadow-outline);
    }
    &:active{
        box-shadow: none;
        transform: translateY(var(--btn3D-elv));
        transition: box-shadow 100ms, transform 100ms;
    }

    &:disabled:not(.loading){
        border-color: var(--c-disabled-border);
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);
        box-shadow: 0 var(--btn3D-elv) var(--c-disabled-border);
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

    &.radius-none{ border-radius: var(--border-radius-none); }
    &.radius-full{ border-radius: var(--border-radius-full); }

    & > .icon{
        font-size: 1em;
        line-height: inherit;
        align-self: stretch;
        aspect-ratio: 1 / 1;
        transition: color 150ms;
    }

    & > .btn-loader{
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: inherit;
        border-radius: inherit;
        background-color: inherit;

        & > .btn-spinner{
            aspect-ratio: 1 / 1;
            box-sizing: border-box;
            border-radius: 50%;
            border-width: 3px;
            border-style: solid;
            border-top-width: 3px;
            border-top-style: solid;
            animation: spin 1000ms linear infinite;
        }
    }
    &:where(.solid) .btn-spinner{
        border-color: white;
        border-top-color: rgb(0 0 0 / 0.4)
    }
    &:where(.soft, .outline) .btn-spinner{
        border-color: var(--c-theme-soft-4);
        border-top-color: var(--c-theme-text-3);
    }
}
.dark .btn3D{
    --btn3D-c-shadow: rgb(0 0 0 / 0.4);

    &:where(.soft, .outline) .btn-spinner{
        border-color: var(--c-theme-outline);
        border-top-color: var(--c-theme-soft-4)
    }
}

/*------------------------------------------------
-------------------- VARIANTS --------------------
------------------------------------------------*/
/*-------- SOLID --------*/
.btn3D.solid{
    --btn3D-c-border: var(--c-theme-border-3);
    background-color: var(--c-theme-1);
    color: var(--c-theme-text-1);

    &:not(:disabled) > .icon{
        color: var(--c-theme-icon-1);
    }
}

/*-------- SOFT --------*/
.btn3D.soft{
    --btn3D-c-border: var(--c-theme-border-2);
    background-color: var(--c-theme-soft-2);
    color: var(--c-theme-text-2);

    &:not(:disabled) > .icon{
        color: var(--c-theme-icon-2);
    }
}

/*-------- OUTLINE --------*/
.btn3D.outline{
    --btn3D-c-border: var(--c-theme-border-2);
    background-color: var(--c-grey-soft-1);
    color: var(--c-grey-text-2);

    &:where(:not(.borderless)){
        border: 1px solid var(--c-theme-border-2);
    }
    &:disabled:not(.loading){
        background-color: var(--c-disabled-2);
    }
    &.loading{
        background-color: var(--c-theme-soft-1);
    }
    &:not(:disabled) > .icon{
        color: var(--c-theme-icon-3);
    }
}

/*--------------------------------------------
-------------------- SIZE --------------------
--------------------------------------------*/
/*-------- SM --------*/
.btn3D.sm{
    font-size: var(--font-size-sm);
    column-gap: 4px;
    padding: 4px 8px;
    &.radius-sm{ border-radius: calc(0.8 * var(--border-radius-sm)); }
    &.radius-md{ border-radius: calc(0.8 * var(--border-radius-md)); }
    &.radius-lg{ border-radius: calc(0.8 * var(--border-radius-lg)); }
    &.squared{ padding: 4px }
    &.compact{
        --btn3D-elv: 4px;
        --btn3D-elv-hover: 3px;
        --btn3D-shadow-x: 4px;
        &:is(:hover, :focus-visible){
            --btn3D-shadow-x: 2px;
        }

        column-gap: 2px;
        padding: 2px 4px;
        &.squared{ padding: 2px }
    }
    &.expanded{
        column-gap: 6px;
        padding: 6px 12px;
        &.squared{ padding: 6px }
    }
}

/*-------- MD --------*/
.btn3D.md{
    font-size: var(--font-size-md);
    column-gap: 6px;
    padding: 6px 12px;
    &.radius-sm{ border-radius: var(--border-radius-sm); }
    &.radius-md{ border-radius: var(--border-radius-md); }
    &.radius-lg{ border-radius: var(--border-radius-lg); }
    &.squared{ padding: 6px }
    &.compact{
        column-gap: 4px;
        padding: 4px 8px;
        &.squared{ padding: 4px }
    }
    &.expanded{
        column-gap: 8px;
        padding: 8px 16px;
        &.squared{ padding: 8px }
    }
}

/*-------- LG --------*/
.btn3D.lg{
    font-size: var(--font-size-lg);
    column-gap: 8px;
    padding: 8px 16px;
    &.radius-sm{ border-radius: calc(1.2 * var(--border-radius-sm)); }
    &.radius-md{ border-radius: calc(1.2 * var(--border-radius-md)); }
    &.radius-lg{ border-radius: calc(1.2 * var(--border-radius-lg)); }
    &.squared{ padding: 8px }
    &.compact{
        column-gap: 6px;
        padding: 6px 12px;
        &.squared{ padding: 6px }
    }
    &.expanded{
        column-gap: 10px;
        padding: 10px 20px;
        &.squared{ padding: 10px }
    }
}

/*-------- XL --------*/
.btn3D.xl{
    --btn3D-elv: 6px;
    --btn3D-elv-hover: 4px;
    --btn3D-shadow-x: 6px;
    &:is(:hover, :focus-visible){
        --btn3D-shadow-x: 4px;
    }

    font-size: var(--font-size-xl);
    column-gap: 10px;
    padding: 10px 20px;
    &.radius-sm{ border-radius: calc(1.4 * var(--border-radius-sm)); }
    &.radius-md{ border-radius: calc(1.4 * var(--border-radius-md)); }
    &.radius-lg{ border-radius: calc(1.4 * var(--border-radius-lg)); }
    &.squared{ padding: 10px }
    &.compact{
        column-gap: 8px;
        padding: 8px 16px;
        &.squared{ padding: 8px }
    }
    &.expanded{
        column-gap: 12px;
        padding: 12px 24px;
        &.squared{ padding: 12px }
    }
}
</style>