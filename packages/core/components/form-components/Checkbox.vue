<script setup>
import Icon from '../Icon.vue'
import { ref, toRef } from 'vue'
import { globalDisabler } from '../../composables/globalDisabler'

const props = defineProps({
    modelValue: {
        validator(v){
            return typeof v === 'boolean' || Array.isArray(v) || (typeof v === 'object' && v !== null)
        }
    },
    name: String,
    value: {
        type: String,
        default: ""
    },
    disabled: Boolean,
    label: {
        type: String,
        default: "Checkbox"
    }
})
const emit = defineEmits(['update:modelValue'])

const modelValue = toRef(props, 'modelValue')

const isBool = typeof modelValue.value === 'boolean'
const isArray = Array.isArray(modelValue.value)
const isObject = !isArray && typeof modelValue.value === 'object' && modelValue.value !== null

const checked = isBool ? modelValue : ref(false)
const initialChecked = isBool ? modelValue.value : isArray ? modelValue.value.includes(props.value) : isObject ? modelValue.value[props.value] : false
if(!isBool && initialChecked) checked.value = initialChecked

if(isObject && !(props.value in modelValue.value)){
    const values = modelValue.value
    values[props.value] = false
    emit("update:modelValue", values)
}

const handleChange = e => {
    if(isBool) emit("update:modelValue", e.target.checked)
    else if(isArray){
        checked.value = e.target.checked
        const values = modelValue.value
        if(e.target.checked){
            values.push(e.target.value)
            emit("update:modelValue", values)
        }
        else emit("update:modelValue", values.filter(v => v !== e.target.value))
    }
    else if(isObject){
        if(props.maxChecked && modelValue.value.keys().length === props.maxChecked) return
        checked.value = e.target.checked
        const values = modelValue.value
        values[e.target.value] = e.target.checked
        emit("update:modelValue", values)
    }
}
</script>

<template>
    <label :class="['checkbox', { disabled: globalDisabler || disabled }]">
        <input
            type="checkbox"
            :name="name"
            :value="value"
            :checked="initialChecked"
            :disabled="globalDisabler || disabled"
            @change="handleChange"/>
        <span>
            <Icon code="check_box_outline_blank"/>
            <Transition>
                <Icon v-if="checked" code="check_box"/>
            </Transition>
        </span>
        <p><slot>{{ label }}</slot></p>
    </label>
</template>

<style scoped>
.checkbox{
    font-size: 1.5rem;

    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}
.checkbox.disabled{
    cursor: not-allowed;
}

.checkbox > input{
    display: none;
}

.checkbox > span{
    position: relative;
    display: flex;
    align-items: center;
}
.checkbox > span > .icon{
    font-size: 22px;
}
.checkbox > input:disabled + span > .icon{
    color: var(--gray4);
}
.checkbox > span > .icon:nth-of-type(1){
    color: var(--brand-c-light);
}
.checkbox > span > .icon:nth-of-type(2){
    position: absolute;
    color: var(--brand-c);
}

.checkbox > p{
    font: 600 1em var(--mainFont);
    margin: 0;
    color: var(--darkText);
    letter-spacing: 0.5px;
}
.checkbox > input:disabled ~ p{
    color: var(--gray4);
}
.checkbox > p::selection{
    background: transparent;
}
.checkbox > p > :deep(a){
    text-decoration: none;
    color: var(--brand-c-dark);
    transition: color 200ms;
}
.checkbox > p > :deep(a:hover){
    text-decoration: underline;
}
.checkbox > p > :deep(a:active){
    color: var(--brand-c-darker);
}
.checkbox > p :deep(a::selection){
    background: transparent;
}

.v-enter-active, .v-leave-active {
  transition: opacity 200ms ease;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
}
</style>