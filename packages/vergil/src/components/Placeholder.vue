<script setup lang="ts">
import { vergil } from '#vergil'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '#utilities'
import Badge from '#components/Badge.vue'
import type { PropType } from 'vue'
import type { Theme, Size, Radius, Spacing } from '#utilities'

defineOptions({ inheritAttrs: false })
defineProps({
    label: String,
    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.placeholder.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.placeholder.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.placeholder.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.placeholder.spacing ?? vergil.config.global.spacing),
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
    --placeholder-pattern-width: 2px;
    --placeholder-pattern-gap: 12px;
    position: relative;
    border: 1px dashed var(--c-grey-border-regular);
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
        top: -1px;
        left: -1px;
    }
}
</style>