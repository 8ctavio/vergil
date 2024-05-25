<script setup>
import Theme from 'vitepress/theme'
import { PopUpBackdrop, Confirm, AlertFeed, Toaster } from '@8ctavio/vergil/components'

const { Layout } = Theme
</script>

<template>
    <Layout/>
    <PopUpBackdrop/>
    <Confirm/>
    <AlertFeed/>
    <Toaster/>
</template>