<script setup>
import MiniMarkup from "./MiniMarkup"
import { inferTheme } from "../../utilities/private"

const props = defineProps({
    label: {
        type: String,
        default: '',
    },
    hint: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    help: {
        type: String,
        default: '',
    },
    floatLabel: Boolean,
    theme: String,
    size: String,
    radius: String,
    spacing: String,
})
</script>

<template>
    <div :class="['form-field', {
        [inferTheme(theme)]: theme,
        [`size-${size}`]: size,
        [`radius-${radius}`]: radius,
        [`spacing-${spacing}`]: spacing,
    }]">
        <div v-if="label || hint" class="form-field-label-wrapper">
            <span v-if="floatLabel">&ZeroWidthSpace;</span>
            <label v-else class="form-field-label">
                <MiniMarkup :str="label"/>
            </label>
            <span class="form-field-hint">
                <MiniMarkup :str="hint"/>
            </span>
        </div>
        <p v-if="description" class="form-field-details form-field-description">
            <MiniMarkup :str="description"/>
        </p>
        <slot/>
        <p v-if="help" class="form-field-details form-field-help">
            <MiniMarkup :str="help"/>
        </p>
    </div>
</template>

<style>
.form-field {
    font-size: var(--font-size);
    line-height: var(--line-height-text);
    display: flex;
    flex-direction: column;
    row-gap: var(--g-gap-sm);

    & > .form-field-label-wrapper {
        font-size: 1em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: var(--g-gap-sm);

        & > :first-child{
            font-size: 0.9em;
            font-weight: 450;
            color: var(--c-text);
        }
        & > :last-child{
            font-size: 0.85em;
            color: var(--c-grey-text-1);
        }
    }
    & > .form-field-details {
        font-size: 0.9em;
        color: var(--c-grey-text-1);
    }
}
</style>