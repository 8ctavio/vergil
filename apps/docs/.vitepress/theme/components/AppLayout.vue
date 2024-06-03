<script setup>
import Theme from 'vitepress/theme'
import { PopupBackdrop, Confirm, Toasters } from '@8ctavio/vergil/components'

const { Layout } = Theme
</script>

<template>
    <Layout/>
    <PopupBackdrop/>
    <Confirm/>
    <Toasters/>
</template>