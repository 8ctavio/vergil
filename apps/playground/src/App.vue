<script setup lang="ts">
import Header from '@/components/Header.vue'
import { Vergil } from '@8ctavio/vergil/components'

</script>

<template>
    <Vergil confirm toaster popup>
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