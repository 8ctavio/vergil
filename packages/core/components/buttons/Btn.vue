<script setup>
import Icon from '../Icon.vue'
import { vergil } from '../../vergil';
import { inferTheme } from '../../functions/utils'
import { isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant, } from '../../functions/utils/validators'

defineProps({
    label: String,
    variant: {
        type: String,
        default: () => vergil.config.btn.variant,
        validator: v => isValidVariant('Btn', v)
    },
    fill: {
        type: Boolean,
        default: () => vergil.config.btn.fill
    },
    borderless: {
        type: Boolean,
        default: () => vergil.config.btn.borderless
    },
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
        default: props => vergil.config.btn.squared || Boolean(!props.label && props.icon)
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
            'btn',
            variant,
            inferTheme(theme),
            size,
            `radius-${radius}`,
            spacing,
            {
                fill,
                borderless,
                squared,
                loading,
            }
        ]"
        :disabled="disabled || loading"
    >
        <span v-if="variant === 'default'" class="btn-underline"></span>
        <div class="btn-content">
            <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
            <slot>{{ label }}</slot>
            <Icon v-if="iconRight" :code="iconRight"/>
            <div v-if="loading" class="btn-loader">
                <span class="btn-spinner"></span>
            </div>
        </div>
    </button>
</template>

<style>
.btn{
    position: relative;
    border: none;
    font-weight: 500;
    line-height: normal;
    cursor: pointer;
    outline: 0 solid transparent;
    transition: background-color 150ms, color 150ms, border 150ms, box-shadow 150ms;

    &:focus-visible{
        outline: 2px solid var(--c-theme-outline);
        outline-offset: 3px;
    }

    &:disabled:not(.loading){
        background-color: var(--c-disabled-1);
        border-color: var(--c-disabled-border);
        color: var(--c-disabled-text);
        cursor: not-allowed;
    }

    &.loading{
        cursor: progress;
        & > .btn-content{
            background-color: inherit;
            & > .btn-loader{
                background-color: inherit;
            }
        }
    }

    &.radius-none{ border-radius: var(--border-radius-none); }
    &.radius-full{ border-radius: var(--border-radius-full); }

    & > .btn-content{
        font-size: 1em;
        position: relative;
        display: grid;
        grid-auto-flow: column;
        line-height: inherit;

        &::selection{
            background-color: transparent;
        }

        & > .icon{
            font-size: 1em;
            line-height: inherit;
            aspect-ratio: 1 / 1;
            transition: color 150ms;
        }

        & > .btn-loader{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;

            & > .btn-spinner{
                aspect-ratio: 1 / 1;
                box-sizing: border-box;
                border-width: 3px;
                border-style: solid;
                border-top-width: 3px;
                border-top-style: solid;
                border-radius: 50%;
                animation: spin 1000ms linear infinite;
            }
        }
    }

    &:where(.default, .solid) .btn-spinner{
        border-color: white;
        border-top-color: rgb(0 0 0 / 0.4)
    }
    &:where(.soft, .ghost, .text, .outline) .btn-spinner{
        border-color: var(--c-theme-soft-4);
        border-top-color: var(--c-theme-text-3);
    }
}
.dark .btn{
    &:where(.soft, .ghost, .text, .outline) .btn-spinner{
        border-color: var(--c-theme-outline);
        border-top-color: var(--c-theme-soft-4)
    }
}

/*------------------------------------------------
-------------------- VARIANTS --------------------
------------------------------------------------*/
/*-------- DEFAULT --------*/
.btn.default{
    background-color: var(--c-grey-soft-1);
    color: var(--c-grey-text-2);
    overflow: hidden;

    &:is(:hover, :focus-visible, .loading){
        background-color: var(--c-theme-1);
    }
    &:is(:hover, :active, :focus-visible){
        color: var(--c-theme-text-1);

        &:not(:disabled) > .btn-content > .icon{
            color: var(--c-theme-icon-1);
        }
    }
    &:active:not(.loading){
        background-color: var(--c-theme-2);

        & > .btn-underline{
            background-color: var(--c-theme-2);
        }
    }
    &:disabled:not(.loading){
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);

        & > .btn-underline{
            background-color: var(--c-disabled-border);
        }
    }

    &:not(:disabled) > .btn-content > .icon{
        color: var(--c-theme-icon-3);
    }

    /*-------- UNDERLINE --------*/
    & > .btn-underline{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: var(--component-border-bottom-width);
        background-color: var(--c-theme-1);
        transition: height 150ms, background-color 150ms;
    }
    &:where(.lg, .xl) > .btn-underline{
        height: calc(var(--component-border-bottom-width) + 0.5px);
    }

    /*-------- FILL --------*/
    &.fill:not(:disabled){
        background-color: var(--c-grey-soft-1); 

        &:is(:hover, :focus-visible){
            background-color: var(--c-grey-soft-1);  
            
            & > .btn-underline{
                height: 100%;
            }
        }
    }

    /*-------- BORDERLESS --------*/
    &.borderless > .btn-underline{
        height: 0;
    }
}

/*-------- SOLID --------*/
.btn.solid{
    background-color: var(--c-theme-1);

    &:not(:disabled){
        color: var(--c-theme-text-1);

        &:is(:hover, :focus-visible){
            background-color: var(--c-theme-2);
        }
        &:active{
            background-color: var(--c-theme-3);
        }

        & > .btn-content > .icon{
            color: var(--c-theme-icon-1);
        }
    }
}

/*-------- SOFT --------*/
.btn.soft{
    background-color: var(--c-theme-soft-2);
    color: var(--c-theme-text-2);

    &:not(:disabled){
        &:is(:hover, :focus-visible){
            background-color: var(--c-theme-soft-3);
        }
        &:active{
            background-color: var(--c-theme-soft-4);
        }
        & > .btn-content > .icon{
            color: var(--c-theme-icon-2);
        }
    }
}

/*-------- GHOST --------*/
.btn.ghost{
    background-color: transparent;
    color: var(--c-theme-text-3);

    &:not(:disabled){
        &:is(:hover, :focus-visible){
            background-color: var(--c-theme-soft-2);
            color: var(--c-theme-text-2)
        }
        &:active{
            background-color: var(--c-theme-soft-3);
            color: var(--c-theme-text-2)
        }
        & > .btn-content > .icon{
            color: var(--c-theme-icon-3);
        }
        &:is(:hover, :focus-visible, :active) > .btn-content > .icon{
            color: var(--c-theme-icon-2);
        }
    }
    &:disabled:not(.loading){
        background-color: var(--c-disabled-2);
    }
    &.loading{
        background-color: var(--c-theme-soft-1);
    }
}

/*-------- TEXT --------*/
.btn.text{
    background-color: transparent;
    color: var(--c-theme-text-3);

    &:not(:disabled){
        &:is(:hover, :focus-visible){
            color: var(--c-theme-text-2);
            text-decoration: underline 1.5px;
            text-underline-offset: 3px;
        }
        & > .btn-content > .icon{
            color: var(--c-theme-icon-3);
        }
    }
    &:disabled:not(.loading){
        background-color: var(--c-disabled-2);
    }
    &.loading{
        background-color: var(--c-theme-soft-1);
    }
}

/*-------- OUTLINE --------*/
.btn.outline{
    background-color: transparent;
    color: var(--c-theme-text-3);
    box-shadow: inset 0 0 0 1px var(--c-theme-border-1);

    &:not(:disabled) {
        &:is(:hover, :focus-visible){
            background-color: var(--c-theme-soft-1);
            color: var(--c-theme-text-2);
            box-shadow: inset 0 0 0 1px var(--c-theme-border-2);
        }
        &:active{
            background-color: var(--c-theme-soft-2);
        }
        & > .btn-content > .icon{
            color: var(--c-theme-icon-3);
        }
    }
    &:disabled:not(.loading){
        background-color: var(--c-disabled-2);
        box-shadow: inset 0 0 0 1px var(--c-disabled-border);
    }
    &.loading{
        background-color: var(--c-theme-soft-1);
    }
}

/*--------------------------------------------
-------------------- SIZE --------------------
--------------------------------------------*/
/*-------- SM --------*/
.btn.sm{
    font-size: var(--font-size-sm);
    padding: 4px 8px;
    &.radius-sm{ border-radius: calc(0.8 * var(--border-radius-sm)); }
    &.radius-md{ border-radius: calc(0.8 * var(--border-radius-md)); }
    &.radius-lg{ border-radius: calc(0.8 * var(--border-radius-lg)); }
    &.squared{ padding: 4px }
    & > .btn-content{ column-gap: 4px; }
    &.compact{
        padding: 2px 4px;
        &.squared{ padding: 2px }
        & > .btn-content{ column-gap: 2px; }
    }
    &.expanded{
        padding: 6px 12px;
        &.squared{ padding: 6px }
        & > .btn-content{ column-gap: 6px; }
    }
}

/*-------- MD --------*/
.btn.md{
    font-size: var(--font-size-md);
    padding: 6px 12px;
    &.radius-sm{ border-radius: var(--border-radius-sm); }
    &.radius-md{ border-radius: var(--border-radius-md); }
    &.radius-lg{ border-radius: var(--border-radius-lg); }
    &.squared{ padding: 6px }
    & > .btn-content{ column-gap: 6px; }
    &.compact{
        padding: 4px 8px;
        &.squared{ padding: 4px }
        & > .btn-content{ column-gap: 4px; }
    }
    &.expanded{
        padding: 8px 16px;
        &.squared{ padding: 8px }
        & > .btn-content{ column-gap: 8px; }
    }
}

/*-------- LG --------*/
.btn.lg{
    font-size: var(--font-size-lg);
    padding: 8px 16px;
    &.radius-sm{ border-radius: calc(1.2 * var(--border-radius-sm)); }
    &.radius-md{ border-radius: calc(1.2 * var(--border-radius-md)); }
    &.radius-lg{ border-radius: calc(1.2 * var(--border-radius-lg)); }
    &.squared{ padding: 8px }
    & > .btn-content{ column-gap: 8px; }
    &.compact{
        padding: 6px 12px;
        &.squared{ padding: 6px }
        & > .btn-content{ column-gap: 6px; }
    }
    &.expanded{
        padding: 10px 20px;
        &.squared{ padding: 10px }
        & > .btn-content{ column-gap: 10px; }
    }
}

/*-------- XL --------*/
.btn.xl{
    font-size: var(--font-size-xl);
    padding: 10px 20px;
    &.radius-sm{ border-radius: calc(1.4 * var(--border-radius-sm)); }
    &.radius-md{ border-radius: calc(1.4 * var(--border-radius-md)); }
    &.radius-lg{ border-radius: calc(1.4 * var(--border-radius-lg)); }
    &.squared{ padding: 10px }
    & > .btn-content{ column-gap: 10px; }
    &.compact{
        padding: 8px 16px;
        &.squared{ padding: 8px }
        & > .btn-content{ column-gap: 8px; }
    }
    &.expanded{
        padding: 12px 24px;
        &.squared{ padding: 12px }
        & > .btn-content{ column-gap: 12px; }
    }
}
</style>