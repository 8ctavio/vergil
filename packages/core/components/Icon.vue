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

<style scoped>
.icon{
    display: flex;
    justify-content: center;
    align-items: center;
}
.icon::selection{ background-color: transparent; }
</style>