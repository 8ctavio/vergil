<script setup>
import Icon from '../Icon.vue'
import { ref, onMounted } from 'vue'
import { closePopUp } from '.'
import { body } from '../../utils/shared'
import { globalDisabler } from '../../composables/useLoaders'

defineProps({
    title: String
})

onMounted(() => {
    if(body.value === null) body.value = document.querySelector('body')
})

const popUp = ref(null)
defineExpose({ elm: popUp })
</script>

<template>
    <div ref="popUp" class='pop-up'>
        <button v-if='!globalDisabler' class='btnClose' @click="closePopUp">
            <Icon code="close"/>
        </button>
        <slot name='controls'></slot>
        <header>
            <h1>{{ title }}</h1>
        </header>
        <div class="scrollWrapper">
            <div class='content'>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pop-up{
    position: relative;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 100px 1fr;
    min-width: 250px;
    min-height: 200px;
    max-height: 95vh;
    border-radius: var(--borderRadius3);
    background-color: var(--gray0);
    box-shadow: var(--boxShadow2);

    font-size: 1rem;
}
.pop-up-enter-from,
.pop-up-leave-to {
    opacity: 0;
    transform: translateY(-150px)
}
.pop-up-enter-active,
.pop-up-leave-active {
    transition: opacity 500ms, transform 500ms ease-out;
}
.pop-up-enter-active{
    transition-delay: 200ms;
}

.pop-up :deep(:where(.btnClose, .btnBack)){
    position: absolute;
    top: 7px;
    right: 7px;
    width: 32px;
    height: 32px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    user-select: none;
}
.pop-up > :deep(.btnBack){ left: 7px; }

.pop-up :deep(:where(.btnClose, .btnBack)) span{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: rgba(255,255,255,0.6);
    transition: color 300ms;
    font-size: 32px;
}
.pop-up :deep(:where(.btnClose, .btnBack)):where(:hover, :focus) span{
    color: white;
}

.pop-up header{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--brand-c);
    border-top-left-radius: var(--borderRadius3);
    border-top-right-radius: var(--borderRadius3);
}
.pop-up header h1{
    margin: 0;
    margin-top: 20px;
    padding: 0;
    font: 600 3em var(--mainFont);
    color: var(--lightText);
    letter-spacing: 1.5px;
}

.scrollWrapper{
    overflow: auto;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 25px;
}
.content {
    position: relative;
    width: 100%;
    font-size: 1em;
}

.content > :deep(h2){
    margin: 0;
    padding: 0;
    font: 600 1.8em var(--mainFont);
    color: var(--brand-c-darkest);
    letter-spacing: 0.5px;
}
.content > :deep(h2):not(:first-of-type){ margin-top: 10px; }
</style>