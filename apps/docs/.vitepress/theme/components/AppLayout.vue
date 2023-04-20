<script setup>
import Theme from 'vitepress/theme'
import { AlertFeed, Toaster } from 'vergil'

const { Layout } = Theme
</script>

<template>
    <Layout/>
    <AlertFeed :style="{'z-index': 100}"/>
    <Toaster :style="{'z-index': 100}"/>
</template>

<style>

</style>