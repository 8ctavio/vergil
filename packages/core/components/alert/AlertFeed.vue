<script setup>
import Alert from './Alert.vue'
import { alertFeed } from '.'

const gap = 15
async function unveilAlert(alert, el){
    alert.el = el
    alert.height = alert.el.getBoundingClientRect().height

    alert.el.style['bottom'] = `-${gap + alert.height}px`
    setTimeout(() => {
        if(!alert.el.style['top']){
            alert.el.style['top'] = `${gap}px`
            alert.el.style['bottom'] = 'initial'
        }
    }, 600)
    let top = gap + alert.height
    alertFeed.value.forEach(a => {
        if(a.id !== alert.id){
            a.el.style['top'] = `${gap + top}px`
            a.el.style['bottom'] = 'initial'
            top += gap + a.height
        }
    })
}
async function closeAlert(alert){
    const index = alertFeed.value.findIndex(a => a.id === alert.id)
    if(index > -1){
        if(alertFeed.value.length === 1){
            alert.el.removeAttribute('style')
            alert.el.style['bottom'] = `-${gap + alert.height}px`
            setTimeout(() => {
                alert.el.removeAttribute('style')
                setTimeout(() => {
                    alertFeed.value.splice(index, 1)
                }, 600)
            }, 50)
        }
        else{
            const top = Number(alert.el.style['top'].split('px')[0])
            alert.el.style['opacity'] = '0'
            alert.el.style['top'] = `${top - 0.5*gap}px`
            setTimeout(() => {
                alertFeed.value.splice(index, 1)
            }, 500)
        }
        let flag = false
        let top = 0
        alertFeed.value.forEach(a => {
            if(flag){
                a.el.style['top'] = `${gap + top}px`
                a.el.style['bottom'] = 'initial'
                top += gap + a.height
            }
            else{
                if(a.id === alert.id) flag = true
                else top += gap + a.height
            }
        })
    }
}
</script>

<template>
    <div id='alert-feed'>
        <Alert v-for="alert in alertFeed" :key="alert.id"
            :message="alert.message"
            :details="alert.details"
            :theme="alert.theme"
            :icon="alert.icon"
            :duration="alert.duration"
            @mounted="el => unveilAlert(alert, el)"
            @close="closeAlert(alert)"
            />
        <!-- <Alert message="Some Message" :style="{ bottom: '-1px' }"/> -->
    </div>
</template>

<style>
#alert-feed{
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 15px;
    z-index: var(--z-index-alert);

    & > .alert{
        position: absolute;
        bottom: 40px;
    }

    /* background-color: rgb(0 0 0 / 0.1);
    width: 50%;
    height: 1px;
    bottom: 50%; */
}
</style>