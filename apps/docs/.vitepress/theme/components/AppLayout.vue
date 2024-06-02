<script setup>
import Theme from 'vitepress/theme'
import { PopupBackdrop, Confirm, AlertFeed, Toaster } from '@8ctavio/vergil/components'

const { Layout } = Theme
</script>

<template>
    <Layout/>
    <PopupBackdrop/>
    <Confirm/>
    <AlertFeed/>
    <Toaster/>
</template>