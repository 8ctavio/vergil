<script setup>
import Icon from '../Icon.vue'
import { isValidTheme, inferTheme } from '../../utils'

defineProps({
    label: String,
    variant: {
        type: String,
        default: 'default',
        validator(value, props){
            return ['default', 'solid', 'soft', 'ghost', 'text', 'outline'].includes(value)
        }
    },
    fill: Boolean,
    borderless: Boolean,
    theme: {
        type: String,
        default: 'brand',
        validator(value, props){
            return isValidTheme(value)
        }
    },
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
            'btn',
            variant,
            inferTheme(theme),
            size,,
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
/* #region themes */
.btn{
    --c-btn-1: var(--c-brand-1);
    --c-btn-2: var(--c-brand-2);
    --c-btn-3: var(--c-brand-3);

    --c-btn-soft-1: var(--c-brand-soft-1);
    --c-btn-soft-2: var(--c-brand-soft-2);
    --c-btn-soft-3: var(--c-brand-soft-3);
    --rgb-btn-soft: var(--rgb-brand-soft);

    --c-btn-text-1: var(--c-brand-text-1);
    --c-btn-text-2: var(--c-brand-text-2);
    --c-btn-text-3: var(--c-brand-text-3);

    --c-btn-icon-1: var(--c-brand-icon-1);
    --c-btn-icon-2: var(--c-brand-icon-2);
    --c-btn-icon-3: var(--c-brand-icon-3);
    --c-btn-icon-4: var(--c-brand-icon-4);

    --c-btn-outline: 3px solid var(--c-btn-soft-3);
    --c-btn-outline-offset: 2px;
}
.dark .btn{
    --c-btn-outline: 2px solid var(--c-btn-1);
    --c-btn-outline-offset: 3px;
}
.btn.ok{
    --c-btn-1: var(--c-ok-1);
    --c-btn-2: var(--c-ok-2);
    --c-btn-3: var(--c-ok-3);

    --c-btn-soft-1: var(--c-ok-soft-1);
    --c-btn-soft-2: var(--c-ok-soft-2);
    --c-btn-soft-3: var(--c-ok-soft-3);
    --rgb-btn-soft: var(--rgb-ok-soft);
    
    --c-btn-text-1: var(--c-ok-text-1);
    --c-btn-text-2: var(--c-ok-text-2);
    --c-btn-text-3: var(--c-ok-text-3);

    --c-btn-icon-1: var(--c-ok-icon-1);
    --c-btn-icon-2: var(--c-ok-icon-2);
    --c-btn-icon-3: var(--c-ok-icon-3);
    --c-btn-icon-4: var(--c-ok-icon-4);
}
.btn.info{
    --c-btn-1: var(--c-info-1);
    --c-btn-2: var(--c-info-2);
    --c-btn-3: var(--c-info-3);

    --c-btn-soft-1: var(--c-info-soft-1);
    --c-btn-soft-2: var(--c-info-soft-2);
    --c-btn-soft-3: var(--c-info-soft-3);
    --rgb-btn-soft: var(--rgb-info-soft);

    --c-btn-text-1: var(--c-info-text-1);
    --c-btn-text-2: var(--c-info-text-2);
    --c-btn-text-3: var(--c-info-text-3);

    --c-btn-icon-1: var(--c-info-icon-1);
    --c-btn-icon-2: var(--c-info-icon-2);
    --c-btn-icon-3: var(--c-info-icon-3);
    --c-btn-icon-4: var(--c-info-icon-4);
}
.btn.warn{
    --c-btn-1: var(--c-warn-1);
    --c-btn-2: var(--c-warn-2);
    --c-btn-3: var(--c-warn-3);

    --c-btn-soft-1: var(--c-warn-soft-1);
    --c-btn-soft-2: var(--c-warn-soft-2);
    --c-btn-soft-3: var(--c-warn-soft-3);
    --rgb-btn-soft: var(--rgb-warn-soft);

    --c-btn-text-1: var(--c-warn-text-1);
    --c-btn-text-2: var(--c-warn-text-2);
    --c-btn-text-3: var(--c-warn-text-3);

    --c-btn-icon-1: var(--c-warn-icon-1);
    --c-btn-icon-2: var(--c-warn-icon-2);
    --c-btn-icon-3: var(--c-warn-icon-3);
    --c-btn-icon-4: var(--c-warn-icon-4);
}
.btn.danger{
    --c-btn-1: var(--c-danger-1);
    --c-btn-2: var(--c-danger-2);
    --c-btn-3: var(--c-danger-3);

    --c-btn-soft-1: var(--c-danger-soft-1);
    --c-btn-soft-2: var(--c-danger-soft-2);
    --c-btn-soft-3: var(--c-danger-soft-3);
    --rgb-btn-soft: var(--rgb-danger-soft);

    --c-btn-text-1: var(--c-danger-text-1);
    --c-btn-text-2: var(--c-danger-text-2);
    --c-btn-text-3: var(--c-danger-text-3);

    --c-btn-icon-1: var(--c-danger-icon-1);
    --c-btn-icon-2: var(--c-danger-icon-2);
    --c-btn-icon-3: var(--c-danger-icon-3);
    --c-btn-icon-4: var(--c-danger-icon-4);
}
.btn.neutral{
    --c-btn-1: var(--c-neutral-1);
    --c-btn-2: var(--c-neutral-2);
    --c-btn-3: var(--c-neutral-3);

    --c-btn-soft-1: var(--c-neutral-soft-1);
    --c-btn-soft-2: var(--c-neutral-soft-2);
    --c-btn-soft-3: var(--c-neutral-soft-3);
    --rgb-btn-soft: var(--rgb-neutral-soft);

    --c-btn-text-1: var(--c-neutral-text-1);
    --c-btn-text-2: var(--c-neutral-text-2);
    --c-btn-text-3: var(--c-neutral-text-3);

    --c-btn-icon-1: var(--c-neutral-icon-1);
    --c-btn-icon-2: var(--c-neutral-icon-2);
    --c-btn-icon-3: var(--c-neutral-icon-3);
    --c-btn-icon-4: var(--c-neutral-icon-4);
}
/* #endregion themes */

.btn{
    font-weight: 500;
    line-height: normal;

    position: relative;
    border-radius: var(--border-radius-md);
    border: none;
    outline: 0 solid transparent;

    cursor: pointer;
    transition: background-color 150ms, color 150ms, border 150ms, box-shadow 150ms, outline 150ms;

    &:focus-visible{
        outline: var(--c-btn-outline);
        outline-offset: var(--c-btn-outline-offset);
    }

    &:disabled:not(.loading){
        background-color: var(--c-disabled-1);
        border-color: var(--c-disabled-2);
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
        border-color: var(--c-btn-soft-3);
        border-top-color: var(--c-btn-text-3);
    }
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/*------------------------------------------------
-------------------- VARIANTS --------------------
------------------------------------------------*/
/*-------- DEFAULT --------*/
.btn.default{
    background-color: var(--c-neutral-soft-1);
    color: var(--c-neutral-text-2);
    overflow: hidden;

    &:is(:hover, :focus-visible, .loading){
        background-color: var(--c-btn-1);
    }
    &:is(:hover, :active, :focus-visible){
        color: var(--c-btn-text-1);

        &:not(:disabled) > .btn-content > .icon{
            color: var(--c-btn-icon-1);
        }
    }
    &:active:not(.loading){
        border-color: var(--c-btn-2);
        background-color: var(--c-btn-2);

        & > .btn-underline{
            background-color: var(--c-btn-2);
        }
    }
    &:disabled:not(.loading){
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);

        & > .btn-underline{
            background-color: var(--c-disabled-2);
        }
    }

    &:not(:disabled) > .btn-content > .icon{
        color: var(--c-btn-icon-4);
    }

    /*-------- UNDERLINE --------*/
    & > .btn-underline{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: var(--component-border-bottom-width);
        background-color: var(--c-btn-1);
        transition: height 150ms, background-color 150ms;
    }
    &:where(.lg, .xl) > .btn-underline{
        height: calc(var(--component-border-bottom-width) + 0.5px);
    }

    /*-------- FILL --------*/
    &.fill:not(:disabled){
        background-color: var(--c-neutral-soft-1); 

        &:is(:hover, :focus-visible){
            background-color: var(--c-neutral-soft-1);  
            
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
    background-color: var(--c-btn-1);

    &:not(:disabled){
        color: var(--c-btn-text-1);

        &:is(:hover, :focus-visible){
            background-color: var(--c-btn-2);
        }
        &:active{
            background-color: var(--c-btn-3);
        }

        & > .btn-content > .icon{
            color: var(--c-btn-icon-1);
        }
    }
}

/*-------- SOFT --------*/
.btn.soft{
    background-color: var(--c-btn-soft-1);
    color: var(--c-btn-text-2);

    &:not(:disabled){
        &:is(:hover, :focus-visible){
            background-color: var(--c-btn-soft-2);
        }
        &:active{
            background-color: var(--c-btn-soft-3);
        }
        & > .btn-content > .icon{
            color: var(--c-btn-icon-2);
        }
    }
}

/*-------- GHOST --------*/
.btn.ghost{
    background-color: transparent;
    color: var(--c-btn-text-3);

    &:not(:disabled){
        &:is(:hover, :focus-visible){
            background-color: var(--c-btn-soft-1);
            color: var(--c-btn-text-2)
        }
        &:active{
            background-color: var(--c-btn-soft-2);
            color: var(--c-btn-text-2)
        }
    }
    &.loading{
        background-color: var(--c-btn-soft-1);
    }
}

/*-------- TEXT --------*/
.btn.text{
    background-color: transparent;
    color: var(--c-btn-text-3);

    &:not(:disabled){
        &:is(:hover, :focus-visible){
            color: var(--c-btn-text-2);
            text-decoration: underline 1.5px;
            text-underline-offset: 3px;
        }
        & > .btn-content > .icon{
            color: var(--c-btn-icon-2);
        }
    }
    &.loading{
        background-color: var(--c-btn-soft-1);
    }
}

/*-------- OUTLINE --------*/
.btn.outline{
    background-color: transparent;
    color: var(--c-btn-text-3);
    box-shadow: inset 0 0 0 1px var(--c-btn-1);

    &:where(.warn){
        border-color: var(--c-btn-3);
    }
    &:not(:disabled) {
        &:is(:hover, :focus-visible){
            background-color: rgb(var(--rgb-btn-soft) / 0.4);
            box-shadow: inset 0 0 0 1px var(--c-btn-2);
        }
        &:active{
            background-color: var(--c-btn-soft-1);
            color: var(--c-btn-text-2);
        }
        & > .btn-content > .icon{
            color: var(--c-btn-icon-2);
        }
    }
    &:disabled:not(.loading){
        box-shadow: inset 0 0 0 1px var(--c-disabled-2);
    }
    &.loading{
        background-color: var(--c-btn-soft-1);
    }
}

/*--------------------------------------------
-------------------- SIZE --------------------
--------------------------------------------*/
/*-------- SM --------*/
.btn.sm{
    font-size: var(--font-size-sm);
    padding: 4px 8px;
    &.squared{ padding: 4px }
    & > .btn-content{ column-gap: 6px; }
    &.compact{
        padding: 2px 4px;
        &.squared{ padding: 2px }
        & > .btn-content{ column-gap: 2px; }
    }
    &.expanded{
        padding: 6px 12px;
        &.squared{ padding: 6px }
        & > .btn-content{ column-gap: 8px; }
    }
}

/*-------- MD --------*/
.btn.md{
    font-size: var(--font-size-md);
    padding: 6px 12px;
    &.squared{ padding: 6px }
    & > .btn-content{ column-gap: 8px; }
    &.compact{
        padding: 4px 8px;
        &.squared{ padding: 4px }
        & > .btn-content{ column-gap: 4px; }
    }
    &.expanded{
        padding: 8px 16px;
        &.squared{ padding: 8px }
        & > .btn-content{ column-gap: 10px; }
    }
}

/*-------- LG --------*/
.btn.lg{
    font-size: var(--font-size-lg);
    padding: 8px 16px;
    &.squared{ padding: 8px }
    & > .btn-content{ column-gap: 10px; }
    &.compact{
        padding: 6px 12px;
        &.squared{ padding: 6px }
        & > .btn-content{ column-gap: 6px; }
    }
    &.expanded{
        padding: 10px 20px;
        &.squared{ padding: 10px }
        & > .btn-content{ column-gap: 12px; }
    }
}

/*-------- XL --------*/
.btn.xl{
    font-size: var(--font-size-xl);
    padding: 10px 20px;
    &.squared{ padding: 10px }
    & > .btn-content{ column-gap: 12px; }
    &.compact{
        padding: 8px 16px;
        &.squared{ padding: 8px }
        & > .btn-content{ column-gap: 8px; }
    }
    &.expanded{
        padding: 12px 24px;
        &.squared{ padding: 12px }
        & > .btn-content{ column-gap: 14px; }
    }
}
</style>