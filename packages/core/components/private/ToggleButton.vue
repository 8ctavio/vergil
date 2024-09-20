<script setup>
import MiniMarkup from './MiniMarkup.vue'

defineProps({
    type: {
        type: String,
        validator: v => ['checkbox', 'radio'].includes(v)
    },
    label: String,
    description: String,
    variant: String,
})

function preventClickSelection(e) {
    if(e.detail > 1) e.preventDefault()
}
</script>

<template>
    <label :class="[type, variant]">
        <slot name="input"/>
        <span v-if="variant === 'classic'" class="toggle-button">
            <svg v-if="type === 'checkbox'" class="toggle-check" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                <path d="m382-388 321-321q19-19 45-19t45 19q19 19 19 45t-19 45L427-253q-19 19-45 19t-45-19L167-423q-19-19-19-45t19-45q19-19 45-19t45 19l125 125Z"/>
            </svg>
            <span v-else-if="type === 'radio'" class="toggle-radio"/>
        </span>
        <p v-if="label || $slots.label" class="toggle-label" @mousedown="preventClickSelection">
            <slot name="label">
                <MiniMarkup :str="label"/>
            </slot>
        </p>
        <p v-if="description || $slots.description" class="toggle-description" @mousedown="preventClickSelection">
            <slot name="description">
                <MiniMarkup :str="description"/>
            </slot>
        </p>
    </label>
</template>

<style>
:is(.checkbox, .radio) {
    font-size: var(--g-font-size);
    line-height: var(--line-height-text);
    position: relative;
    color: var(--c-text);
    cursor: pointer;

    &:has(input:disabled){
        color: var(--c-disabled-text);
        cursor: not-allowed;
    }

    & > input:is([type="checkbox"], [type="radio"]) {
        appearance: none;
        pointer-events: none;
        position: absolute;
        margin: 0;
        opacity: 0;
    }

    &:not(.card) > .toggle-description {
        font-size: 0.9em;
        color: var(--c-grey-text-1);
    }
}

/*-------- CLASSIC --------*/
:is(.checkbox, .radio).classic {
    display: grid;
    grid-template-columns: repeat(2,auto);
    justify-content: start;
    column-gap: var(--g-gap-md);
    row-gap: var(--g-gap-xs);

    &:hover > .toggle-button {
        border-color: var(--c-theme-solid-1);
    }

    & > input:is([type="checkbox"], [type="radio"]) {
        &:focus-visible + .toggle-button {
            outline: 2px solid var(--c-theme-outline);
            outline-offset: 2px;
        }
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
        width: calc(1em * var(--font-size-scale-icon));
        height: calc(1em * var(--font-size-scale-icon));
        border-radius: var(--g-radius);
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
            background-color: var(--c-theme-text-3);
        }
    }
    & > .toggle-description {
        grid-column-start: 2;
        grid-row-start: 2;
    }
}
.checkbox.classic > .toggle-button {
    transition: background-color 150ms, border-color 150ms;
}

/*-------- CARD --------*/
:is(.checkbox, .radio).card {
    --toggle-border-c: var(--c-grey-border-subtle);
    --toggle-border-w: 1px;
    display: flex;
    flex-direction: column;
    row-gap: var(--g-gap-sm);
    padding: var(--g-gap-lg) var(--g-gap-xl);
    border-radius: var(--g-radius);
    background-color: var(--c-bg);
    box-shadow: inset 0 0 0 var(--toggle-border-w) var(--toggle-border-c);
    transition: box-shadow 150ms;

    &:hover {
        --toggle-border-c: var(--c-grey-border-regular);
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):focus-visible) {
        --toggle-border-c: var(--c-grey-border-regular);
        background-color: var(--c-theme-soft-2);
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):checked) {
        --toggle-border-c: var(--c-theme-1);
        --toggle-border-w: 1.5px;
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):disabled) {
        --toggle-border-c: var(--c-disabled-border-1);
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):disabled:checked) {
        --toggle-border-c: var(--c-disabled-border-2);
    }

    & > .toggle-label {
        text-align: center;
        &:has(+ .toggle-description) {
            font-weight: 600;
            text-align: left;
        }
    }
}

/*-------- TOGGLE --------*/
:is(.checkbox, .radio).toggle {
    display: flex;
    flex-direction: column;
    row-gap: var(--g-gap-xs);
    padding: var(--g-gap-md) var(--g-gap-lg);
    border-radius: var(--g-radius);
    background-color: var(--c-grey-soft-3);
    color: var(--c-grey-text-2);
    transition: background-color 150ms, color 150ms;

    &:hover:not(:disabled) {
        color: var(--c-text);
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):focus-visible) {
        background-color: var(--c-grey-soft-2);
        color: var(--c-text);
        outline: 2px solid var(--c-theme-1);
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):checked) {
        background-color: var(--c-theme-4);
        color: var(--c-theme-text-2);
        & > .toggle-description {
            color: var(--c-theme-text-2);
        }
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):disabled) {
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):disabled:checked) {
        background-color: var(--c-disabled-2);
    }

    & > .toggle-label {
        text-align: center;
        &:has(+ .toggle-description) {
            font-weight: 500;
            text-align: left;
        }
    }
}

/*-------- LIST --------*/
:is(.checkbox, .radio).list {
    display: flex;
    flex-direction: column;
    row-gap: var(--g-gap-xs);
    padding: var(--g-gap-md) var(--g-gap-lg);
    border-radius: var(--g-radius);
    background-color: #FCFCFC;
    transition: background-color 150ms, color 150ms;

    &:hover {
        background-color: var(--c-grey-soft-1);
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):focus-visible) {
        outline: 2px solid var(--c-theme-outline);
        background-color: var(--c-theme-soft-1);
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):checked) {
        background-color: var(--c-theme-soft-2);
        & > .toggle-description {
            color: inherit;
        }
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):disabled) {
        background-color: var(--c-disabled-1);
        color: var(--c-disabled-text);
    }
    &:has(> input:is([type="checkbox"],[type="radio"]):disabled:checked) {
        background-color: var(--c-disabled-2);
    }
}
:where(.dark) :is(.checkbox, .radio) {
    &:is(.toggle, .list) {
        background-color: #0A0A0A;
    }
}
</style>