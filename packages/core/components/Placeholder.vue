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
    --placeholder-pattern-width: 1px;
    --placeholder-pattern-gap: 8px;
    position: relative;
    border: 1.5px dashed var(--c-grey-border-regular);
    border-radius: var(--g-radius);
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