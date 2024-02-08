<script setup>
import Loader from '../Loader.vue'
import Icon from '../Icon.vue'
import { globalDisabler } from '../../composables/useLoaders'
import { ref, useAttrs } from 'vue'

const attrs = useAttrs()

defineProps({
    label: String,
    disabled: Boolean,
    loading: Boolean,
    icon: String,
    iconLeft: String,
    iconRight: String
})

const btnClasses = attrs.class?.split(' ') ?? []

const type = btnClasses.find(c => ['default', 'primary', 'secondary', 'outlined', 'text'].includes(c))
const theme = btnClasses.find(c => ['brand', 'ok', 'info', 'warn', 'danger', 'gray'].includes(c))
</script>

<template>
    <button
        :class="[
            'btn', 
            {
                loading,
                default: typeof type === 'undefined',
                brand: typeof theme === 'undefined',
                test: fill
            }
        ]"
        :disabled="globalDisabler || disabled || loading"
    >
        <span v-if="typeof type === 'undefined' || type === 'default'" class="btn-fill"></span>
        <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
        <span class="btn-label"><slot>{{ label }}</slot></span>
        <Icon v-if="iconRight" :code="iconRight"/>
        <Loader v-if="loading" 
            :class="[
                theme ?? 'brand',
                {
                    primary: [undefined, 'default', 'primary'].includes(type),
                    secondary: ['secondary', 'outlined', 'text'].includes(type)
                }
            ]"
        />
    </button>
</template>

<style>
/*----------------------------------------------
-------------------- THEMES --------------------
----------------------------------------------*/
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
.btn.gray{
    --c-btn-1: var(--c-gray-1);
    --c-btn-2: var(--c-gray-2);
    --c-btn-3: var(--c-gray-3);

    --c-btn-soft-1: var(--c-gray-soft-1);
    --c-btn-soft-2: var(--c-gray-soft-2);
    --c-btn-soft-3: var(--c-gray-soft-3);
    --rgb-btn-soft: var(--rgb-default-soft);

    --c-btn-text-1: var(--c-gray-text-1);
    --c-btn-text-2: var(--c-gray-text-2);
    --c-btn-text-3: var(--c-gray-text-3);

    --c-btn-icon-1: var(--c-gray-icon-1);
    --c-btn-icon-2: var(--c-gray-icon-2);
    --c-btn-icon-3: var(--c-gray-icon-3);
    --c-btn-icon-4: var(--c-gray-icon-4);
}

.btn{
    font-size: var(--font-size-std);
    font-weight: 500;

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: normal;

    border-radius: var(--border-radius-base);
    outline: 0 solid transparent;

    background-color: var(--elm-c-bg-1);
    color: var(--elm-c-text);

    cursor: pointer;
    transition: background-color 300ms, color 300ms, border 300ms, box-shadow 300ms, outline 100ms;
}
.btn::selection{ background-color: transparent; }

/*---------------------------------------------
-------------------- TYPES --------------------
---------------------------------------------*/
/*-------- DEFAULT --------*/
.btn{
    border: var(--elm-border-width) solid var(--c-btn-1);
    overflow: hidden;
}
.btn:is(:hover, :focus-visible){
    background-color: var(--c-btn-1);
}
.btn:is(:hover, :active, :focus-visible){
    color: var(--c-btn-text-1);
}
.btn:focus-visible{
    outline: var(--c-btn-outline);
    outline-offset: var(--c-btn-outline-offset);
}
.btn:active:not(.loading){
    border-color: var(--c-btn-2);
    background-color: var(--c-btn-2);
}
.btn:disabled:not(.loading){
    border-color: var(--c-disabled-2);
    background-color: var(--c-disabled-1);
    color: var(--c-disabled-text);
    cursor: default;
}
.btn.loading{
    cursor: default;
}

.btn-fill{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: var(--elm-border-bottom-width);
    background-color: var(--c-btn-1);
    transition: height 200ms, background-color 300ms;
}
.btn:active:not(.loading) > .btn-fill{
    background-color: var(--c-btn-2);
}

.btn > :is(.icon, .btn-label){
    position: relative;
}

/*-------- DEFAULT: BORDERLESS --------*/
.btn.borderless{
    border: none;
}
.btn.borderless > .btn-fill{
    height: 0;
}

/*-------- DEFAULT: FILL --------*/
.btn.default.fill:not(:disabled):is(:hover, :focus-visible){
background-color: var(--elm-bg-c);  
}
.btn.default.fill:not(:disabled):is(:hover, :focus-visible) > .btn-fill{
    height: 100%;
}

/*------------------ PRIMARY ------------------*/
.btn.primary{
    border: none;
    background-color: var(--c-btn-1);
}
.btn.primary:not(:disabled){
    color: var(--c-btn-text-1);
}
.btn.primary:not(:disabled, .loading):is(:hover, :focus-visible){
    background-color: var(--c-btn-2);
}
.btn.primary:not(:disabled):active{
    background-color: var(--c-btn-3);
}

/*------------------ SECONDARY ------------------*/
.btn.secondary{
    border: none;
    background-color: var(--c-btn-soft-1);
    color: var(--c-btn-text-2);
}
.btn.secondary:not(:disabled, .loading):is(:hover, :focus-visible){
    background-color: var(--c-btn-soft-2);
}
.btn.secondary:not(:disabled):active{
    background-color: var(--c-btn-soft-3);
}

/*------------------ OUTLINED ------------------*/
.btn.outlined{
    border: 1px solid var(--c-btn-1);
    background-color: transparent;
    color: var(--elm-c-text);
}
.btn.outlined:where(.warn){
    border-color: var(--c-btn-3);
}
.btn.outlined:not(:disabled):is(:hover, :focus-visible){
    background-color: var(--elm-c-bg-1);
}
.btn.outlined:not(:disabled):active{
    background-color: var(--elm-c-bg-2);
}

/*------------------ TEXT ------------------*/
.btn.text{
    border: none;
    background-color: transparent;
    color: var(--c-btn-text-3);
}

.btn.text:not(:disabled, .loading):is(:hover, :focus-visible){
    color: var(--c-btn-text-2);
    background-color: rgb(var(--rgb-btn-soft) / 0.3);
}
.btn.text:not(:disabled):active{
    color: var(--c-btn-text-2);
    background-color: rgb(var(--rgb-btn-soft) / 0.5);
}

.btn.text.warn:not(:disabled, .loading):is(:hover, :focus-visible){
    background-color: rgb(var(--rgb-btn-soft) / 0.4);
}
.btn.text.warn:not(:disabled):active{
    background-color: rgb(var(--rgb-btn-soft) / 0.6);
}

.dark .btn.text:not(:disabled, .loading):is(:hover, :focus-visible){
    background-color: rgb(var(--rgb-btn-soft) / 0.6);
}
.dark .btn.text:not(:disabled):active{
    background-color: rgb(var(--rgb-btn-soft) / 0.8);
}

.dark .btn.text.info:not(:disabled, .loading):is(:hover, :focus-visible){
    color: var(--c-btn-text-2);
    background-color: rgb(var(--rgb-btn-soft) / 0.7);
}
.dark .btn.text.info:not(:disabled):active{
    color: var(--c-btn-text-2);
    background-color: rgb(var(--rgb-btn-soft) / 0.9);
}

/*--------------------------------------------
-------------------- SIZE --------------------
--------------------------------------------*/
/*-------- SMALL --------*/
.btn.sm.compact{
    padding: 2px 8px;
}
.btn.sm{
    font-size: var(--font-size-sm);
    padding: 4px 12px;
}
.btn.sm.expanded{
    padding: 8px 16px;
}

/*-------- DEFAULT --------*/
.btn.compact{
    padding: 3px 10px;
    gap: 5px;
}
.btn{
    padding: 5px 15px;
    gap: 10px;
}
.btn.expanded{
    padding: 10px 20px;
}

/*-------- LARGE --------*/
.btn.lg.compact{
    padding: 4px 12px;
}
.btn.lg{
    font-size: var(--font-size-lg);
    padding: 6px 18px;
}
.btn.lg.expanded{
    padding: 12px 24px;
}

/*---------------------------------------------
-------------------- ICONS --------------------
---------------------------------------------*/
.btn > .icon{
    font-size: 1.214em;
    transition: color 300ms;
}

.btn.default:is(:hover, :active, :focus-visible):not(:disabled) > .icon,
.btn.primary:not(:disabled) > .icon{
    color: var(--c-btn-icon-1);
}

.btn.secondary:not(:disabled) > .icon{
    color: var(--c-btn-icon-2);
}
.btn.text.warn:is(:hover, :active, :focus-visible):not(:disabled) > .icon{
    color: var(--c-btn-icon-2);
}

.btn:is(.outlined, .text):not(:disabled) > .icon{
    color: var(--c-btn-icon-3);
}

.btn.default:not(:disabled) > .icon,
.btn.outlined:is(:hover, :active, :focus-visible):not(:disabled) > .icon{
    color: var(--c-btn-icon-4);
}

/*------------------ SQUARED ------------------*/
/*-------- SMALL --------*/
.btn.squared.sm.compact{
    padding: 4px;
}
.btn.squared.sm{
    padding: 6px;
}
.btn.squared.sm > .icon{
    font-size: 1.3em;
}
.btn.squared.sm.expanded{
    padding: 8px;
}

/*-------- DEFAULT --------*/
.btn.squared.compact{
    padding: 5px;
}
.btn.squared{
    padding: 7px;
}
.btn.squared > .icon{
    font-size: 1.5em;
}
.btn.squared.expanded{
    padding: 9px;
}

/*-------- LARGE --------*/
.btn.squared.lg.compact{
    padding: 6px;
}
.btn.squared.lg{
    padding: 8px;
}
.btn.squared.lg > .icon{
    font-size: 1.7em;
}
.btn.squared.lg.expanded{
    padding: 10px;
}
</style>