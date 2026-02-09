<script setup lang="ts">
import { vPreventClickSelection } from '#utilities'
import MiniMarkup from '#components/.internal/MiniMarkup'
import type { PropType } from 'vue'
import type { ToggleVariant } from '#components'
import type { Radius } from '#utilities'

defineProps({
    type: {
        type: String as PropType<'checkbox' | 'radio'>,
        validator: (v: string) => ['checkbox', 'radio'].includes(v)
    },
    label: String,
    description: String,
    variant: String as PropType<ToggleVariant>,
    showSymbol: Boolean,
    radius: String as PropType<Radius>,
})
</script>

<template>
    <label :class="[type, variant]" v-prevent-click-selection>
        <slot name="input"/>
        <span v-if="variant === 'classic' || showSymbol"
            :class="['toggle-button', radius && `radius-${radius}`]">
            <svg v-if="type === 'checkbox'" class="toggle-check" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                <path d="m382-388 321-321q19-19 45-19t45 19q19 19 19 45t-19 45L427-253q-19 19-45 19t-45-19L167-423q-19-19-19-45t19-45q19-19 45-19t45 19l125 125Z"/>
            </svg>
            <span v-else-if="type === 'radio'" class="toggle-radio"/>
        </span>
        <p v-if="label || $slots.label" class="toggle-label">
            <slot name="label">
                <MiniMarkup :str="label"/>
            </slot>
        </p>
        <p v-if="description || $slots.description" class="toggle-description">
            <slot name="description">
                <MiniMarkup :str="description"/>
            </slot>
        </p>
    </label>
</template>

<style>
:is(.checkbox,.radio) {
    font-size: var(--font-size);
    line-height: var(--line-height-text);
    position: relative;
    display: grid;
    justify-content: start;
    row-gap: var(--g-gap-xs);
    color: var(--c-text);
    cursor: pointer;

    &:not(.classic) {
        &:hover > .toggle-button,
        & > input:focus-visible + .toggle-button {
            border-color: rgb(var(--rgb-grey-border) / 0.40);
        }
        &.invalid:hover > .toggle-button,
        &.invalid > input:focus-visible + .toggle-button {
            border-color: var(--c-theme-border-regular);
        }
    }

    &:has(> input:disabled) {
        color: var(--c-disabled-text);
        cursor: not-allowed;
    }
    &:has(> .toggle-button) {
        grid-template-columns: repeat(2,auto);
        column-gap: var(--g-gap-md);
    }

    & > input:is([type="checkbox"],[type="radio"]) {
        appearance: none;
        pointer-events: none;
        position: absolute;
        margin: 0;
        opacity: 0;

        &:checked + .toggle-button {
            background-color: var(--c-theme-solid-1);
            border-color: var(--c-theme-solid-1);
            & > :is(.toggle-check, .toggle-radio) {
                opacity: 1;
            }
            & > .toggle-check {
                transform: scale(1);
            }
            & > .toggle-radio {
                transform: scale(0.5);
            }
        }
        &:disabled + .toggle-button {
            border-color: var(--c-disabled-border-1);
            background-color: var(--c-disabled-2);
        }
        &:disabled:checked + .toggle-button {
            border-color: var(--c-disabled-border-3);
            background-color: var(--c-disabled-border-3);
            & > .toggle-check {
                fill: var(--c-disabled-1);
            }
            & > .toggle-radio {
                background-color: var(--c-disabled-2);
            }
        }
    }
    & > .toggle-button {
        box-sizing: border-box;
        position: relative;
        align-self: center;
        width: calc(1em * var(--font-size-scale-icon));
        height: calc(1em * var(--font-size-scale-icon));
        border-radius: var(--g-radius-full, var(--g-radius-md));
        border: 2px solid var(--c-grey-border-subtle);
        transition: border-color 150ms;

        & > :is(.toggle-check, .toggle-radio) {
            position: absolute;
            inset: 0;
            opacity: 0;
            transform: scale(0);
            transition: opacity 150ms, transform 200ms var(--bezier-bounce-out);
        }
        & > .toggle-check {
            fill: var(--c-theme-text-3);
        }
        & > .toggle-radio {
            border-radius: inherit;
            background-color: light-dark(var(--c-theme-text-3), var(--c-theme-text-2));
        }
        & ~ .toggle-description {
            grid-column-start: 2;
            grid-row-start: 2;
        }
    }
    &.invalid > .toggle-button {
        border-color: var(--c-theme-border-subtle);
    }

    &:not(.card) > .toggle-description {
        font-size: 0.9em;
    }
}
.checkbox > .toggle-button {
    transition: background-color 150ms, border-color 150ms;
}

/*-------- CLASSIC --------*/
:is(.checkbox, .radio).classic {
    &:hover > .toggle-button,
    &.invalid > .toggle-button {
        border-color: var(--c-theme-solid-1);
    }
    & > input:focus-visible + .toggle-button {
        outline: 2px solid var(--c-theme-outline);
        outline-offset: 2px;
    }
    & > .toggle-description {
        color: var(--c-grey-text-1);
    }
}

/*-------- CARD --------*/
:is(.checkbox, .radio).card {
    row-gap: var(--g-gap-sm);
    padding: var(--g-gap-2xl) var(--g-gap-3xl);
    border-radius: var(--g-radius-full, var(--g-radius-md));
    background-color: var(--c-bg);
    box-shadow: inset 0 0 0 var(--toggle-bw, 1px) var(--toggle-bc, var(--c-grey-border-subtle));
    transition: box-shadow 150ms;

    &:hover {
        --toggle-bc: var(--c-theme-border-regular);
    }
    &.invalid {
        color: var(--c-theme-text-2);
        --toggle-bc: var(--c-theme-border-regular);
    }
    &:has(> input:focus-visible) {
        --toggle-bc: var(--c-theme-border-regular);
        background-color: var(--c-theme-soft-2);
        &.invalid { --toggle-bc: var(--c-theme-solid-1) }
    }
    &:has(> input:checked) {
        --toggle-bw: 1.5px;
        --toggle-bc: var(--c-theme-1);
    }
    &:has(> input:disabled) {
        --toggle-bc: var(--c-disabled-border-1);
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);
    }
    &:has(> input:disabled:checked) {
        --toggle-bc: var(--c-disabled-border-2);
    }

    & > .toggle-label:has(+ .toggle-description) {
        font-weight: 600;
    }
}

/*-------- LIST --------*/
:is(.checkbox, .radio).list {
    padding: var(--g-gap-md) var(--g-gap-2xl);
    border-radius: var(--g-radius-full, var(--g-radius-md));
    background-color: var(--c-bg);
    box-shadow: inset 0 0 0 var(--toggle-bw, 0) var(--toggle-bc, transparent);
    transition: background-color 150ms, color 150ms, box-shadow 150ms;

    &:hover {
        --toggle-bw: 0.8px;
        --toggle-bc: var(--c-grey-border-subtle);
        background-color: var(--c-grey-soft-1);
        &:where(.invalid) {
            background-color: var(--c-theme-soft-1);
        }
    }
    &:has(> input:focus-visible) {
        outline: 2px solid var(--c-theme-outline);
        background-color: var(--c-grey-soft-1);
    }
    &:has(> input:checked) {
        --toggle-bc: var(--c-theme-border-subtle);
        background-color: var(--c-theme-soft-2);
    }
    &:is(label).invalid {
        --toggle-bw: 1px;
        --toggle-bc: var(--c-theme-solid-1);
    } 
    &:has(> input:disabled) {
        --toggle-bw: 0px;
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);
    }
    &:has(> input:disabled:checked) {
        background-color: var(--c-disabled-2);
    }

    & > input:not(:checked) ~ .toggle-description {
        color: var(--c-grey-text-1);
    }
}

/*-------- TOGGLE --------*/
:is(.checkbox, .radio).toggle {
    padding: var(--g-gap-md) var(--g-gap-2xl);
    border-radius: var(--g-radius-full, var(--g-radius-md));
    background-color: var(--c-bg-alt);
    color: var(--c-grey-text-1);
    transition: background-color 150ms, color 150ms;

    &:hover {
        color: var(--c-text);
    }
    &.invalid {
        color: var(--c-theme-text-1);
        box-shadow: inset 0 0 0 1px var(--c-theme-solid-1);
        &:where(:hover) {
            color: var(--c-theme-text-2);
        }
    }
    &:has(> input:focus-visible) {
        background-color: var(--c-grey-soft-2);
        color: var(--c-text);
        outline: 2px solid var(--c-theme-1);
    }
    &:has(> input:checked) {
        background-color: var(--c-theme-4);
        color: var(--c-theme-text-2);
    }
    &:has(> input:disabled) {
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);
    }
    &:has(> input:disabled:checked) {
        background-color: var(--c-disabled-2);
    }

    & > input:disabled + .toggle-button {
        border-color: var(--c-disabled-border-2);
    }
    & > .toggle-label:has(+ .toggle-description) {
        font-weight: 500;
    }
}
</style>