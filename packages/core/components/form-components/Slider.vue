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
    virtualMin: {
        type: Number,
        default(rawProps){ return rawProps.min }
    },
    virtualMax: {
        type: Number,
        default(rawProps){ return rawProps.max }
    },
    step: {
        type: Number,
        default: 1
    },
    disabled: Boolean,
    staticProgress: Boolean
})
const modelValue = toRef(props, 'modelValue')

const emit = defineEmits(['update:modelValue'])

const sliderProgress = computed(() => 100*(modelValue.value - props.min)/(props.max - props.min))
const sliderWidth = computed(() => `${sliderProgress.value}% + ${7*(50-sliderProgress.value)/50}px`)

const handleInput = e => {
    emit('update:modelValue', e.target.valueAsNumber)
}
const handleChange = e => {
    if(props.virtualMin !== props.min && props.virtualMin > props.min && e.target.valueAsNumber < props.virtualMin) emit('update:modelValue', props.virtualMin)
    if(props.virtualMax !== props.max && props.virtualMax < props.max && e.target.valueAsNumber > props.virtualMax) emit('update:modelValue', props.virtualMax)
}
</script>

<template>
    <div class="slider">
        <div>
            <label v-if="'label' in $slots">
                <slot name="label"></slot>
            </label>
            <div :class="[{ staticProgress, disabled: globalDisabler || disabled}, 'sliderWrapper']">
                <span class="track"></span>
                <span class="progress"></span>
                <input 
                    type="range"    
                    :value="modelValue"
                    @input="handleInput"
                    @change="handleChange"
                    ref="input"
                    :min="min"
                    :max="max"
                    :step="step"
                    :disabled="globalDisabler || disabled"
                />
            </div>
        </div>
        <p>
            <slot name="value"></slot>
        </p>
    </div>
</template>

<style scoped>
.slider{
    display: flex;
    align-items: center;
    gap: 15px;

    font: 500 1rem var(--mainFont);
}

.slider > div{
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.slider > div label{
    font-size: max(1em, 9.5px);
    display: flex;
    align-items: center;
    gap: 10px;
}

.slider > p{
    font: 700 1.8em var(--font1);
    color: var(--brand-c-darker)
}

.sliderWrapper{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;
    width: 1em;

    --track-height: 3px;
    --thumb-rad: 6px;
    --static-progress: 0.15em;
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
.sliderWrapper.disabled .progress{
    background-color: var(--gray4);
}
.sliderWrapper.staticProgress{ margin-left: var(--static-progress); }
.sliderWrapper.staticProgress > .progress{
    left: calc(var(--static-progress) * -1);
    width: calc(v-bind(sliderWidth) + var(--static-progress));
}

.sliderWrapper > input{
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
.sliderWrapper.disabled > input{
    cursor: initial;
}
.sliderWrapper > input::-webkit-slider-thumb{
    appearance: none;
    width: calc(var(--thumb-rad) * 2);
    height: calc(var(--thumb-rad) * 2);
    border-radius: 50%;
    background-color: var(--brand-c);
    transition: box-shadow 300ms;
}
.sliderWrapper.disabled > input::-webkit-slider-thumb{
    background-color: var(--gray4);
}
.sliderWrapper:not(.disabled) > input::-webkit-slider-thumb:hover{
    box-shadow: 0 0 0 6px rgba(var(--brand-c-rgb-light), 0.3);
}
.sliderWrapper:not(.disabled) > input::-webkit-slider-thumb:active{
    box-shadow: 0 0 0 10px rgba(var(--brand-c-rgb-light), 0.3);
}
.sliderWrapper > input::-moz-range-thumb{
    appearance: none;
    width: calc(var(--thumb-rad) * 2);
    height: calc(var(--thumb-rad) * 2);
    border-radius: 50%;
    border: none;
    background-color: var(--brand-c);
    transition: box-shadow 300ms;
}
.sliderWrapper > input::-moz-range-thumb:hover{
    box-shadow: 0 0 0 6px rgba(var(--brand-c-rgb-light), 0.3);
}
.sliderWrapper > input::-moz-range-thumb:active{
    box-shadow: 0 0 0 10px rgba(var(--brand-c-rgb-light), 0.3);
}
</style>