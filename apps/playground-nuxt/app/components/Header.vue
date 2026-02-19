<script setup lang="ts">
import { Switch } from 'vergil/components'
import { ColorPicker } from 'vergil/utilities/userTheme'

const checked = import.meta.client && sessionStorage?.getItem('playground-theme') === 'dark'
onBeforeMount(() => {
	if (checked) {
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
		<ClientOnly>
			<ColorPicker/>
			<Switch @change="toggleTheme" :checked icon-off="light_mode" icon-on="dark_mode" track="on"/>
		</ClientOnly>
	</header>
</template>