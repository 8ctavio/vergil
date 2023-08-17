<script setup>
import Icon from '../Icon.vue'

defineProps({
    modelValue: Boolean,
    label: {
        type: String,
        default: "Checkbox"
    }
})

defineEmits(['update:modelValue'])
</script>

<template>
    <label class="checkbox">
        <input type="checkbox" :value="modelValue" @change="$emit('update:modelValue', $event.target.checked)"/>
        <span>
            <Icon code="check_box_outline_blank"/>
            <Transition>
                <Icon v-if="modelValue" code="check_box"/>
            </Transition>
        </span>
        <p><slot>{{ label }}</slot></p>
    </label>
</template>

<style scoped>
.checkbox{
    font-size: 1rem;

    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
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
    font-size: 2.2em;
}
.checkbox > span > .icon:nth-of-type(1){
    color: var(--brand-c-light);
}
.checkbox > span > .icon:nth-of-type(2){
    position: absolute;
    color: var(--brand-c);
}

.checkbox > p{
    font: 600 1.5em var(--mainFont);
    margin: 0;
    color: var(--darkText);
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