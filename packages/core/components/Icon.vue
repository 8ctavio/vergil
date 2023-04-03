<script setup>
defineProps({
    code: String
})
</script>

<template>
    <span class="material-icons-round icon">
        <slot>{{ code }}</slot>
    </span>
</template>

<style>
span.material-icons-round::selection{ background-color: transparent; }
</style>