<script setup>
import Badge from './Badge.vue'
import { vergil } from '../vergil'
import { isValidRadius, isValidSize } from '../utilities/private'

defineOptions({ inheritAttrs: false })
defineProps({
    label: String,
    size: {
        type: String,
        default: () => vergil.config.placeholder.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.placeholder.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    },
})
</script>

<template>
    <div :class="['placeholder', `radius-${radius}`, `size-${size}`]">
        <Badge v-if="label" v-bind="$attrs" :label :size :radius/>
    </div>
</template>

<style>
.placeholder {
    --placeholder-pattern-width: 2px;
    --placeholder-pattern-gap: 10px;
    position: relative;
    border: 2px dashed var(--c-grey-border-subtle-4);
    border-radius: var(--g-radius);
    background: repeating-linear-gradient(
        -45deg,
        var(--c-grey-soft-3),
        var(--c-grey-soft-3) var(--placeholder-pattern-width),
        transparent var(--placeholder-pattern-width),
        transparent var( --placeholder-pattern-gap)
    );
    & > .badge {
        position: absolute;
        top: -2px;
        left: -2px;
    }
}
</style>