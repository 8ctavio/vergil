<script setup>
import Icon from '../Icon.vue'

defineProps({
    label: String,
    size: {
        type: String,
        default: 'md',
        validator(value, props){
            return ['sm', 'md', 'lg', 'xl'].includes(value)
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
            size,,
            spacing,
            {
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
/*--------------------------------------------------
-------------------- BOX-SHADOW --------------------
--------------------------------------------------*/
.btn3D{
    --btn3D-elv: 5px;
    --btn3D-elv-hover: 3px;
    --btn3D-elv-dif: calc(var(--btn3D-elv) - var(--btn3D-elv-hover));
    --btn3D-border: var(--btn3D-elv);

    --btn3D-shadow-x: 5px;
    --btn3D-shadow-y: calc(var(--btn3D-border) + var(--btn3D-shadow-x));
    --btn3D-outline-width: 2px;
    --btn3D-outline-offset: 3px;
    --btn3D-outline-span: calc(var(--btn3D-outline-width) + var(--btn3D-outline-offset));

    --btn3D-shadow-1: 0 var(--btn3D-border) var(--c-theme-3);
    --btn3D-shadow-2: var(--btn3D-shadow-x) var(--btn3D-shadow-y) 1px rgb(0 0 0 / 0.15);
    --btn3D-shadow-outline: 0px 0px 0px var(--btn3D-outline-offset) var(--c-bg-alt),
                            0px var(--btn3D-elv-hover) 0px var(--btn3D-outline-offset) var(--c-bg-alt),
                            0px 0px 0px var(--btn3D-outline-span) var(--c-theme-outline),
                            0px var(--btn3D-elv-hover) 0px var(--btn3D-outline-span) var(--c-theme-outline);

    &:is(:hover, :focus-visible){
        --btn3D-border: var(--btn3D-elv-hover);
        --btn3D-shadow-x: 3px;
    }
}

.btn3D{
    font-size: var(--font-size-std);
    font-weight: 500;
    line-height: normal;

    position: relative;
    display: grid;
    grid-auto-flow: column;

    border: none;
    border-radius: var(--border-radius-sm);

    background-color: var(--c-theme-1);
    color: var(--c-theme-text-1);

    box-shadow: var(--btn3D-shadow-1), var(--btn3D-shadow-2);

    cursor: pointer;
    transition: box-shadow 150ms, transform 150ms;

    &:is(:hover, :focus-visible){
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
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);
        box-shadow: 0 var(--btn3D-elv) var(--c-disabled-border);
        cursor: not-allowed;
        transform: translateY(0);
    }
    &.loading{
        box-shadow: 0 var(--btn3D-elv) var(--c-theme-3);
        cursor: progress;
        transform: translateY(0);
    }

    &::selection{
        background-color: transparent;
    }

    & > .icon{
        font-size: 1em;
        line-height: inherit;
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
            border-color: white;
            border-top-color: rgb(0 0 0 / 0.4);
            animation: spin 1000ms linear infinite;
        }
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