<script setup>
import Icon from '../Icon.vue'
import { ref, toRef } from 'vue'
import { globalDisabler } from '../../composables/useLoaders'

const props = defineProps({
    modelValue: {
        validator(v){
            return ['boolean', 'string'].includes(typeof v) || Array.isArray(v) || (typeof v === 'object' && v !== null)
        }
    },
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
const isString = typeof modelValue.value === 'string'
const isArray = Array.isArray(modelValue.value)
const isObject = !isArray && typeof modelValue.value === 'object' && modelValue.value !== null

const initialChecked =  isBool ? modelValue.value :
                        isString ? modelValue.value === props.value :                 
                        isArray ? modelValue.value.includes(props.value) :
                        isObject ? modelValue.value[props.value] : false
const checked = ref(initialChecked)

if(isObject && !(props.value in modelValue.value)){
    const values = modelValue.value
    values[props.value] = false
    emit("update:modelValue", values)
}

const handleChange = e => {
    checked.value = e.target.checked
    if(isBool) emit("update:modelValue", e.target.checked)
    else if(isString) emit("update:modelValue", checked.value ? e.target.value : '')
    else if(isArray){
        const values = modelValue.value
        if(e.target.checked){
            values.push(e.target.value)
            emit("update:modelValue", values)
        }
        else emit("update:modelValue", values.filter(v => v !== e.target.value))
    }
    else if(isObject){
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
    font: 500 1.2rem var(--mainFont);

    display: flex;
    align-items: center;
    gap: 0.417em;
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
    font-size: 20px;
    transition: color 300ms;
}
.checkbox > span > .icon:is(.v-enter-active, .v-leave-active){
    transition: opacity 200ms ease;
}
.checkbox > span > .icon:is(.v-enter-from, .v-leave-to){
    opacity: 0;
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
    margin: 0;
    color: var(--darkText);
    letter-spacing: 0.5px;
    transition: color 300ms
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
</style>