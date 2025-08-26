<script setup lang="ts">
import { Switch } from '@8ctavio/vergil/components'
import { ColorPicker } from '@8ctavio/vergil/utilities/userTheme'

const checked = sessionStorage.getItem('playground-theme') === 'dark'
if (checked) {
	document.documentElement.classList.add('dark')
} else {
	document.documentElement.classList.remove('dark')
}

function toggleTheme() {
	if (sessionStorage.getItem('playground-theme') === 'dark') {
	    document.documentElement.classList.remove('dark')
		sessionStorage.setItem('playground-theme', 'light')
	} else {
	    document.documentElement.classList.add('dark')
		sessionStorage.setItem('playground-theme', 'dark')
	}
}
</script>

<template>
	<header>
		<ColorPicker/>
		<Switch @change="toggleTheme" :checked icon-off="light_mode" icon-on="dark_mode" track="on"/>
	</header>
</template>