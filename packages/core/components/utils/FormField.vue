<script setup>
import MiniMarkup from "./MiniMarkup.vue"

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
    size: String,
    radius: String,
    spacing: String,
})
</script>

<template>
    <div
        :class="[
            'form-field',
            `size-${size}`,
            `radius-${radius}`,
            `spacing-${spacing}`,
        ]">
        <div v-if="label || hint" class="form-field-label-wrapper">
            <span v-if="floatLabel">&#8203;</span>
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
    font-size: var(--g-font-size);
    line-height: var(--line-height-text);
    display: flex;
    flex-direction: column;
    row-gap: calc(0.8 * var(--g-gap-1));

    & > .form-field-label-wrapper {
        font-size: 1em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: calc(0.8 * var(--g-gap-1));

        & > :first-child{
            font-size: 0.9em;
            font-weight: 450;
            color: var(--c-text);
        }
        & > :last-child{
            font-size: 0.85em;
            color: var(--c-grey-text-3);
        }
    }
    & > .form-field-details {
        font-size: 0.9em;
        color: var(--c-grey-text-3);
    }
}
</style>