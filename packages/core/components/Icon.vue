<script setup>
defineProps({
    code: String
})
</script>

<template>
    <span class="material-symbols-rounded icon">
        <slot>{{ code }}</slot>
    </span>
</template>

<style>
.icon::selection{ background-color: transparent; }
</style>