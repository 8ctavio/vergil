<script setup>
import Theme from 'vitepress/theme'
import { Confirm, AlertFeed, Toaster } from 'vergil/components'

const { Layout } = Theme
</script>

<template>
    <Layout/>
    <Confirm :style="{'z-index': 99}"/>
    <AlertFeed :style="{'z-index': 100}"/>
    <Toaster :style="{'z-index': 100}"/>
</template>

<style>

</style>