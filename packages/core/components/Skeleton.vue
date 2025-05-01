<script setup lang="ts">
import { vergil } from '../vergil'
import { isValidRadius, isValidSize, isValidSpacing } from '../utilities'
import type { PropType } from 'vue'
import type { Size, Radius, Spacing } from '../types'

defineProps({
    descendant: Boolean,
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.skeleton.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.skeleton.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.skeleton.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    },
})
</script>

<template>
    <div :class="['skeleton', {
        [`size-${size}`]: size,
        [`radius-${radius}`]: radius,
        [`spacing-${spacing}`]: spacing,
    }]">
        &ZeroWidthSpace;
    </div>
</template>

<style>
.skeleton {
    font-size: var(--font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-md);
    border-radius: var(--g-radius-full, var(--g-radius-md));
    background-color: light-dark(#C0C0C0, #383838);
    animation: pulse 1s var(--bezier-sine-in-out) infinite alternate;
}
</style>