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
    position: relative;
    display: flex;
    align-items: center;
    width: 45px;
    height: 20px;
    border: none;
    border-radius: 25px;
    background-color: var(--brand-c);
    cursor: pointer;
    transition: background-color 200ms;
}
.switch.toggleBg:not(.on){
    background-color: var(--brand-c-lighter);
}

.switch :deep(span){
    position: absolute;
    left: 4px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: var(--gray0);
    transition: left 300ms;
}
.switch.on :deep(span){
    left: calc(100% - 15px - 4px);
}

.label{
    position: absolute;
    font: 600 1.4rem var(--mainFont);
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