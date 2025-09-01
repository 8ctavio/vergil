<script setup lang="ts">
import { isRef, computed } from 'vue'
import { MiniMarkup } from "#components"
import { inferTheme } from "#utilities"
import type { PropType, ShallowRef } from "vue"
import type { Theme, Size, Radius, Spacing } from "#types"

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
    errors: Object as PropType<ShallowRef<string[]>>,
    showErrors: Boolean,
    theme: String as PropType<Theme>,
    size: String as PropType<Size>,
    radius: String as PropType<Radius>,
    spacing: String as PropType<Spacing>,
})

const errors = props.errors
const error = isRef(errors)
    ? computed(() => Array.isArray(errors.value) && errors.value.length > 0)
    : false
</script>

<template>
    <div :class="['form-field', theme && (error ? 'danger' : inferTheme(theme)), {
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
        <template v-if="showErrors && error">
            <p v-if="(errors as string[]).length === 1" class="form-field-details form-field-error">
                {{ (errors as string[])[0] }}
            </p>
            <ul v-else class="form-field-details form-field-error">
                <li v-for="error of errors">
                    {{ error }}
                </li>
            </ul>
        </template>
        <p v-else-if="help" class="form-field-details form-field-help">
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
    & > ul.form-field-error {
        margin: 0;
        padding-left: var(--g-gap-3xl);
        & > li:nth-child(n + 2) {
            margin-top: var(--g-gap-sm);
        }
    }
    & > .form-field-error {
        color: var(--c-theme-text-1);
    }
}
</style>