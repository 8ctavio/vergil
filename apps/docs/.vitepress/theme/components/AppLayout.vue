<script setup>
import Theme from 'vitepress/theme'
import { PopUpBackdrop, Confirm, AlertFeed, Toaster } from 'vergil/components'

const { Layout } = Theme
</script>

<template>
    <Layout/>
    <PopUpBackdrop/>
    <Confirm/>
    <AlertFeed/>
    <Toaster/>
</template>

<style>

</style>