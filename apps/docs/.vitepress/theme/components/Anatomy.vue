<script setup>
defineProps({
    tag: String,
    classes: {
        type: String,
        default: ''
    }
})
</script>

<template>
    <div :class="['anatomy', { parent: $slots.default }]">
        <p><{{ tag }}<b>{{ classes.split(/\s+/).reduce((a,b) => b ? `${a}.${b}` : '', '') }}</b>/></p>
        <section v-if="$slots.default">
            <slot/>
        </section>
    </div>
</template>

<style scoped>
.anatomy{
    font-size: 1.2rem;
    border-radius: 4px;
    background-color: rgb(var(--rgb-theme) / 0.05);
    border: 1px dashed rgb(var(--rgb-theme) / 0.5);
    color: var(--c-text);
    font-family: var(--font-mono);
    letter-spacing: 0.5px;

    &:hover {
        background-color: rgb(var(--rgb-theme) / 0.08);
        border-color: rgb(var(--rgb-theme) / 1);
    }
    & > section{
        display: flex;
        flex-direction: column;
        row-gap: 8px;
        padding: 8px 15px;
    }
    & > p {
        font-weight: 500;
        & > b {
            font-weight: 700;
        }
    }
    &.parent {
        display: flex;
        flex-direction: column;
        row-gap: 8px;
        & > p{
            margin-left: -1px;
            margin-top: -1px;
            width: max-content;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid var(--c-theme-1);
            background-color: rgb(var(--rgb-theme-soft) / 0.9);
        }
    }
    &:not(.parent) > p{
        padding: 4px 8px;
    }
}
</style>