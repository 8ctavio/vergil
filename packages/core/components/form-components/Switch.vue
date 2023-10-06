<script setup>
import { toRef } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    showLabels: Boolean,
    labelOff: {
        type: String,
        default: 'Off'
    },
    labelOn: {
        type: String,
        default: 'On'
    },
    toggleBg: {
        type: Boolean,
        default: true
    }
})
const modelValue = toRef(props, 'modelValue')
defineEmits(['update:modelValue'])

</script>

<template>
    <button :class="[{on: modelValue, toggleBg}, 'switch']" @click="$emit('update:modelValue', !modelValue)">
        <label v-if="showLabels" class="label off">{{ labelOff }}</label>
        <span></span>
        <label v-if="showLabels" class="label on">{{ labelOn }}</label>
    </button>
</template>

<style scoped>
.switch{
    --size: 2em;

    position: relative;
    display: flex;
    align-items: center;
    width: calc(var(--size) * 2.25);
    height: var(--size);
    border: none;
    border-radius: var(--size);
    background-color: var(--brand-c);
    cursor: pointer;
    transition: background-color 200ms;
    font-size: 1rem;
}
.switch.toggleBg:not(.on){
    background-color: var(--brand-c-lighter);
}

.switch :deep(span){
    position: absolute;
    left: 4px;
    width: calc(var(--size) - 5px);
    height: calc(var(--size) - 5px);
    border-radius: 50%;
    background-color: var(--gray0);
    transition: left 300ms;
}
.switch.on :deep(span){
    left: calc(100% - var(--size) + 5px - 4px);
}

.label{
    position: absolute;
    font: 600 max(1.4em, 12.6px) var(--mainFont);
    color: var(--gray3);
    cursor: pointer;
    transition: color 200ms;
}
.label.off{ right: calc(100% + 10px); }
.label.on{ left: calc(100% + 10px); }
.switch.on .label.on, .switch:not(.on) .label.off{
    color: var(--brand-c);
}
</style>