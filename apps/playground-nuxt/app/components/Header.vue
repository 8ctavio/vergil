<script setup lang="ts">
import { shallowRef } from 'vue'
import { Switch } from '@8ctavio/vergil/components'
import { ColorPicker } from '@8ctavio/vergil/utilities/userTheme'

const checked = shallowRef(false)
onBeforeMount(() => {
	checked.value = sessionStorage.getItem('playground-theme') === 'dark'
	if (checked.value) {
		document.documentElement.classList.add('dark')
	} else {
		document.documentElement.classList.remove('dark')
	}
})

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