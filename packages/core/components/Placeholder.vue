<script setup>
import Badge from './Badge.vue'
import { vergil } from '../vergil'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../utilities/private'

defineOptions({ inheritAttrs: false })
defineProps({
    label: String,
    descendant: Boolean,
    theme: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.placeholder.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.placeholder.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.placeholder.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.placeholder.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    },
})
</script>

<template>
    <div :class="['placeholder', {
        [inferTheme(theme)]: theme,
        [`size-${size}`]: size,
        [`radius-${radius}`]: radius,
        [`spacing-${spacing}`]: spacing,
    }]">
        <Badge v-if="label" v-bind="$attrs" :label descendant/>
    </div>
</template>

<style>
.placeholder {
    --placeholder-pattern-width: 1px;
    --placeholder-pattern-gap: 8px;
    position: relative;
    border: 1.5px dashed var(--c-grey-border-regular);
    border-radius: var(--g-radius-full, var(--g-radius-md));
    background: repeating-linear-gradient(
        -45deg,
        var(--c-grey-border-subtle),
        var(--c-grey-border-subtle) var(--placeholder-pattern-width),
        transparent var(--placeholder-pattern-width),
        transparent var(--placeholder-pattern-gap)
    );
    background-color: var(--c-bg);
    & > .badge {
        position: absolute;
        top: -2px;
        left: -2px;
    }
}
</style>