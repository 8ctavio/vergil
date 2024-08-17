<script setup>
import { vergil } from '../vergil'
import { isValidRadius, isValidSize, isValidSpacing } from '../utilities/private'

defineProps({
    size: {
        type: String,
        default: () => vergil.config.skeleton.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.skeleton.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: () => vergil.config.skeleton.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
})
</script>

<template>
    <div
        :class="[
            'skeleton',
            `size-${size}`,
            `radius-${radius}`,
            `spacing-${spacing}`,
        ]">
        &ZeroWidthSpace;
    </div>
</template>

<style>
.skeleton {
    font-size: var(--g-font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-md);
    border-radius: var(--g-radius);
    background-color: #C0C0C0;
    animation: pulse 1s var(--bezier-sine-in-out) infinite alternate;
}
.dark .skeleton {
    background-color: #383838;
}
</style>