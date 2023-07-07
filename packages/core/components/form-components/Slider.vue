<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    modelValue:{
        type: Number,
        default: 50
    },
    min:{
        type: Number,
        default: 0
    },
    max:{
        type: Number,
        default: 100
    },
    step:{
        type: Number,
        default: 1
    }
})
const emit = defineEmits('update:modelValue')

const sliderProgress = ref(100*(props.modelValue - props.min)/(props.max - props.min))
const handleInput = e => {
    sliderProgress.value = 100*(e.target.value - props.min)/(props.max - props.min)
    emit('update:modelValue', e.target.value)
}
const sliderWidth = computed(() => `${sliderProgress.value}% + ${7*(50-sliderProgress.value)/50}px`)
</script>

<template>
    <div class="sliderWrapper">
        <span class="track"></span>
        <span class="progress"></span>
        <input class="slider" type="range" :value="modelValue" @input="handleInput" :min="min" :max="max" :step="step"/>
    </div>
</template>

<style scoped>
.sliderWrapper{
    position: relative;
    display: flex;
    align-items: center;
    padding: 0;
}
.track{
    position: absolute;
    left: 0;
    height: 4px;
    border-radius: 3px;
    width: 100%;
    background-color: var(--gray2);
}
.progress{
    position: absolute;
    left: 0;
    height: 4px;
    border-radius: 4px;
    width: calc(v-bind(sliderWidth));
    background-color: var(--brand-c-light);
}

.slider{
    appearance: none;
    width: 100%;
    height: 4px;
    margin: 0;
    padding: 0;
    border-radius: 4px;
    background-color: transparent;
    cursor: pointer;
    z-index: 1;
}
.slider::-webkit-slider-thumb{
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: var(--brand-c);
    transition: box-shadow 300ms, transform 300ms;
}
.slider::-webkit-slider-thumb:hover{
    box-shadow: 3px 3px 2px 0 var(--gray4), 0 0 0 6px #759B6145;
}
.slider::-webkit-slider-thumb:active{
    box-shadow: 3px 3px 2px 0 var(--gray4), 0 0 0 8px #759B6145;
}
.slider::-moz-range-thumb{
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: none;
    background-color: var(--brand-c);
    transition: box-shadow 300ms, transform 300ms;
}
.slider::-moz-range-thumb:hover{
    box-shadow: 3px 3px 2px 0 var(--gray4), 0 0 0 6px #759B6145;
}
.slider::-moz-range-thumb:active{
    box-shadow: 3px 3px 2px 0 var(--gray4), 0 0 0 8px #759B6145;
}
</style>