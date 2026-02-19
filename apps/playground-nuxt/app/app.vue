<script setup lang="ts">
import '@/assets/css/playground.css'
import { Vergil } from 'vergil/components'

useHead({
	title: 'Vergil | Nuxt Playground'
})
</script>

<template>
    <Vergil confirm toaster modal>
        <Header/>
        <main class="playground">

        </main>
    </Vergil>
</template>

<style>
.playground {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>