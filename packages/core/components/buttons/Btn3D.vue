<script setup>
import Icon from '../Icon.vue'
import { globalDisabler } from '../../composables/useLoaders'

defineProps({
    label: String,
    disabled: Boolean,
    loading: Boolean,
    icon: String,
    iconLeft: String,
    iconRight: String
})
</script>

<template>
    <button
        :class="[
            'btn3d', 
            {
                loading,
                default: typeof type === 'undefined',
                brand: typeof theme === 'undefined',
            }
        ]"
        :disabled="globalDisabler || disabled || loading"
    >
        <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
        <slot>{{ label }}</slot>
        <Icon v-if="iconRight" :code="iconRight"/>
    </button>
</template>

<style>
/*-------------------------------------------------------
-------------------- BOX-SHADOW SIZE --------------------
-------------------------------------------------------*/
.btn3d{
    --btn3d-elv: 5px;
    --btn3d-elv-hover: 3px;
    --btn3d-elv-dif: calc(var(--btn3d-elv) - var(--btn3d-elv-hover));

    --btn3d-shadow-x: 5px;
    --btn3d-shadow-y: 10px;
    --btn3d-outline-offset: 8px;

    --btn3d-border-width: var(--btn3d-elv);

    --btn3d-c-bg: var(--c-brand-1);
    --btn3d-c-border: var(--c-brand-3);
    --btn3d-c-text: var(--c-brand-text-1);
    --btn3d-c-icon: var(--c-brand-icon-1);
    --btn3d-c-outline: var(--c-brand-soft-1);
}
.dark .btn3d{
    --btn3d-c-bg: var(--c-brand-soft-3);
    --btn3d-c-border: var(--c-brand-soft-1);
    --btn3d-c-text: white;
    --btn3d-c-icon: var(--c-brand-icon-2);
    --btn3d-c-outline: var(--c-brand-1);
    --btn3d-outline-offset: 6px;
}
.btn3d:is(:hover, :focus-visible){
    --btn3d-shadow-x: 3px;
    --btn3d-shadow-y: 6px;

    --btn3d-border-width: var(--btn3d-elv-hover);
}

.btn3d:where(.sm){
    --btn3d-elv: 4px;
    --btn3d-elv-hover: 3px;
    --btn3d-shadow-x: 4px;
    --btn3d-shadow-y: 8px;
    --btn3d-outline-offset: 7px;
}
.btn3d.sm.compact{
    --btn3d-elv: 3px;
    --btn3d-elv-hover: 2px;
    --btn3d-shadow-x: 3px;
    --btn3d-shadow-y: 7px;
}
.btn3d.sm.compact:is(:hover, :focus-visible){
    --btn3d-shadow-x: 2px;
    --btn3d-shadow-y: 5px;
}

.btn3d.lg.expanded{
    --btn3d-elv: 6px;
    --btn3d-elv-hover: 4px;
    --btn3d-shadow-x: 6px;
    --btn3d-shadow-y: 12px;
}
.btn3d.lg.expanded:is(:hover, :focus-visible){
    --btn3d-shadow-x: 3px;
    --btn3d-shadow-y: 7px;
}

.btn3d{
    --btn3d-shadow-1: 0 var(--btn3d-border-width) var(--btn3d-c-border);
    --btn3d-shadow-2: var(--btn3d-shadow-x) var(--btn3d-shadow-y) 1px rgb(0 0 0 / 0.15);
    --btn3d-shadow-outline: 0px var(--btn3d-elv-dif) 0px var(--btn3d-outline-offset) var(--btn3d-c-outline);
}
.dark .btn3d{
    --btn3d-shadow-2: 0 0;
}

.btn3d{
    font-size: var(--font-size-std);
    font-weight: 600;

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: normal;

    border: none;
    border-radius: var(--border-radius-base);
    outline: 0 solid transparent;

    background-color: var(--btn3d-c-bg);
    color: var(--btn3d-c-text);

    box-shadow: var(--btn3d-shadow-1), var(--btn3d-shadow-2);

    cursor: pointer;
    transition: box-shadow 200ms, transform 200ms, outline 100ms;
}
.btn3d::selection{ background-color: transparent; }

.btn3d:is(:hover, :focus-visible){
    outline: none;
    transform: translateY(var(--btn3d-elv-dif));
}
.btn3d:focus-visible{
    box-shadow: var(--btn3d-shadow-1), var(--btn3d-shadow-2), var(--btn3d-shadow-outline);
}
.btn3d:active{
    transition: box-shadow 100ms, transform 100ms, outline 100ms;
    transform: translateY(var(--btn3d-elv));
    box-shadow: none;
}

.btn3d:disabled:not(.loading){
    background-color: var(--c-disabled-1);
    color: var(--c-disabled-text);
    box-shadow: 0 5px var(--c-disabled-2);
    transform: translateY(0);
    cursor: default;
}
.btn3d.loading:not(.disabled){
    box-shadow: 0 5px var(--btn3d-c-border);
    transform: translateY(0);
    cursor: default;
}
.dark .btn3d.loading:not(.disabled) > .loader{
    background-color: var(--btn3d-c-bg);
}

/*-------- SMALL --------*/
.btn3d.sm.compact{
    padding: 2px 8px;
}
.btn3d.sm{
    font-size: var(--font-size-sm);
    padding: 4px 12px;
}
.btn3d.sm.expanded{
    padding: 8px 16px;
}

/*-------- DEFAULT --------*/
.btn3d.compact{
    padding: 3px 10px;
    gap: 5px;
}
.btn3d{
    padding: 5px 15px;
    gap: 10px;
}
.btn3d.expanded{
    padding: 10px 20px;
}

/*-------- LARGE --------*/
.btn3d.lg.compact{
    padding: 4px 12px;
}
.btn3d.lg{
    font-size: var(--font-size-lg);
    padding: 6px 18px;
}
.btn3d.lg.expanded{
    padding: 12px 24px;
}

/*---------------------------------------------
-------------------- ICONS --------------------
---------------------------------------------*/
.btn3d > .icon{
    font-size: 1.214em;
    font-weight: 400;
    transition: color 300ms;
}
.btn3d:not(:disabled) > .icon{
    color: var(--btn3d-c-icon);
}

/*------------------ SQUARED ------------------*/
/*-------- SMALL --------*/
.btn3d.squared.sm.compact{
    padding: 4px;
}
.btn3d.squared.sm{
    padding: 6px;
}
.btn3d.squared.sm > .icon{
    font-size: 1.3em;
}
.btn3d.squared.sm.expanded{
    padding: 8px;
}

/*-------- DEFAULT --------*/
.btn3d.squared.compact{
    padding: 5px;
}
.btn3d.squared{
    padding: 7px;
}
.btn3d.squared > .icon{
    font-size: 1.5em;
}
.btn3d.squared.expanded{
    padding: 9px;
}

/*-------- LARGE --------*/
.btn3d.squared.lg.compact{
    padding: 6px;
}
.btn3d.squared.lg{
    padding: 8px;
}
.btn3d.squared.lg > .icon{
    font-size: 1.7em;
}
.btn3d.squared.lg.expanded{
    padding: 10px;
}
</style>