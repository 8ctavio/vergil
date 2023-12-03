<script setup>
import { globalDisabler } from '../../composables/useLoaders'
import { InputField } from '../../composables/inputFields'

const emit = defineEmits(['update:modelValue'])
const { modelValue, value } = defineProps({
    modelValue: {
        type: [String, InputField],
        default: ''
    },
    name: String,
    value: {
        type: String,
        default: ""
    },
    disabled: Boolean,
    label: {
        type: String,
        default: "Radio"
    }
})

const handleChange = e => {
    if(modelValue instanceof InputField)
        modelValue.value = e.target.value
    else
        emit('update:modelValue', e.target.value)
}
const initialChecked = value === ((modelValue instanceof InputField) ? modelValue.value : modelValue)
</script>

<template>
    <template v-if="(modelValue instanceof InputField)">
        <label :class="['radio', { disabled: globalDisabler || disabled || modelValue.disabled }]">
            <input
                type="radio"
                :name="name"
                :value="value"
                :checked="initialChecked"
                :disabled="globalDisabler || disabled || modelValue.disabled"
                @change="handleChange"/>
            <span class="icon">
                <Transition :duration="150">
                    <span v-if="value === modelValue.value" class="icon-outer">
                        <span class="icon-inner"></span>
                    </span>
                </Transition>
            </span>
            <p><slot>{{ label }}</slot></p>
        </label>
    </template>
    <template v-else>
        <label :class="['radio', { disabled: globalDisabler || disabled }]">
            <input
                type="radio"
                :name="name"
                :value="value"
                :checked="initialChecked"
                :disabled="globalDisabler || disabled"
                @change="handleChange"/>
            <span class="icon">
                <Transition :duration="150">
                    <span v-if="value === modelValue" class="icon-outer">
                        <span class="icon-inner"></span>
                    </span>
                </Transition>
            </span>
            <p><slot>{{ label }}</slot></p>
        </label>
    </template>
</template>

<style scoped>
.radio{
    font: 500 1.2rem var(--mainFont);

    display: flex;
    align-items: center;
    gap: 0.417em;
    cursor: pointer;
}
.radio.disabled{
    cursor: not-allowed;
}

.radio > input{
    display: none;
}

.icon{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid var(--gray4);
    transition: border 200ms;
}
.radio:not(.disabled):hover > .icon{
    border-color: var(--brand-c-lighter);
}

.icon-outer{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--brand-c);
}
.radio > input:disabled + .icon .icon-outer{
    background-color: var(--gray5);
}

.icon-inner{   
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
}

.icon-outer:is(.v-leave-active){
    transition: opacity 150ms ease-in-out;
}
.icon-outer:is(.v-leave-to){
    opacity: 0;
}
.icon-outer:is(.v-enter-active, .v-leave-active) .icon-inner{
    transition: transform 150ms ease-in-out;
}
.icon-outer:is(.v-enter-from, .v-leave-to) .icon-inner{
    transform: scale(0);
}

.radio > p{
    margin: 0;
    color: var(--darkText);
    letter-spacing: 0.5px;
    transition: color 300ms
}
.radio > input:disabled ~ p{
    color: var(--gray4);
}
.radio > p::selection{
    background: transparent;
}
.radio > p > :deep(a){
    text-decoration: none;
    color: var(--brand-c-dark);
    transition: color 200ms;
}
.radio > p > :deep(a:hover){
    text-decoration: underline;
}
.radio > p > :deep(a:active){
    color: var(--brand-c-darker);
}
.radio > p :deep(a::selection){
    background: transparent;
}
</style>