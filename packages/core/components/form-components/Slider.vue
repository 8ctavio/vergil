<script setup>
import { computed, toRef } from 'vue'

const props = defineProps({
    modelValue: {
        type: Number,
        default: 0
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 100
    },
    step: {
        type: Number,
        default: 1
    },
    staticProgress: Boolean
})
const modelValue = toRef(props, 'modelValue')

defineEmits(['update:modelValue'])

const sliderProgress = computed(() => 100*(modelValue.value - props.min)/(props.max - props.min))
const sliderWidth = computed(() => `${sliderProgress.value}% + ${7*(50-sliderProgress.value)/50}px`)
</script>

<template>
    <div class="slider">
        <label>
            <slot name="label"></slot>
        </label>
        <p>
            <slot name="value"></slot>
        </p>
        <div :class="[{ staticProgress }, 'sliderWrapper' ]">
            <span class="track"></span>
            <span class="progress"></span>
            <input 
                type="range"    
                class="slider"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.valueAsNumber)"
                :min="min"
                :max="max"
                :step="step"
            />
        </div>
    </div>
</template>

<style scoped>
div.slider{
    display: grid;
    grid-template-columns: max-content auto;
    gap: 15px;

    font: 500 1rem var(--mainFont);
}
div.slider > label{
    display: flex;
    align-items: center;
    gap: 10px;
}

div.slider > p{
    grid-row: span 2;
    justify-self: center;
    align-self: center;
    font: 700 1.8em var(--font1);
    color: var(--brand-c-darker)
}

.sliderWrapper{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;

    --track-height: 3px;
    --thumb-rad: 6px;
    --static-progress: 30px;
}
.track{
    position: absolute;
    left: 0;
    height: var(--track-height);
    border-radius: var(--track-height);
    width: 100%;
    background-color: var(--gray2);
}
.progress{
    position: absolute;
    left: 0;
    height: var(--track-height);
    border-radius: var(--track-height);
    width: calc(v-bind(sliderWidth));
    background-color: var(--brand-c-light);
}
.sliderWrapper.staticProgress{ margin-left: var(--static-progress); }
.sliderWrapper.staticProgress > .progress{
    left: calc(var(--static-progress) * -1);
    width: calc(v-bind(sliderWidth) + var(--static-progress));
}

input.slider{
    appearance: none;
    width: 100%;
    height: var(--track-height);
    margin: 0;
    padding: 0;
    border-radius: var(--track-height);
    background-color: transparent;
    cursor: pointer;
    z-index: 1;
}
input.slider::-webkit-slider-thumb{
    appearance: none;
    width: calc(var(--thumb-rad) * 2);
    height: calc(var(--thumb-rad) * 2);
    border-radius: 50%;
    background-color: var(--brand-c);
    transition: box-shadow 300ms;
}
input.slider::-webkit-slider-thumb:hover{
    box-shadow: 0 0 0 6px rgba(var(--brand-c-rgb-light), 0.3);
}
input.slider::-webkit-slider-thumb:active{
    box-shadow: 0 0 0 10px rgba(var(--brand-c-rgb-light), 0.3);
}
input.slider::-moz-range-thumb{
    appearance: none;
    width: calc(var(--thumb-rad) * 2);
    height: calc(var(--thumb-rad) * 2);
    border-radius: 50%;
    border: none;
    background-color: var(--brand-c);
    transition: box-shadow 300ms;
}
input.slider::-moz-range-thumb:hover{
    box-shadow: 0 0 0 6px rgba(var(--brand-c-rgb-light), 0.3);
}
input.slider::-moz-range-thumb:active{
    box-shadow: 0 0 0 10px rgba(var(--brand-c-rgb-light), 0.3);
}
</style>