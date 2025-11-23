// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme-without-fonts'
const { Layout } = DefaultTheme

import './styles/custom.css'
import './styles/overrides.css'

import { h } from 'vue'
import { ClientOnly } from 'vitepress/dist/client/app/components/ClientOnly'
import Demo from './components/Demo.vue'
import Anatomy from './components/Anatomy.vue'
import { Vergil } from 'vergil/components'
import { ColorPicker } from 'vergil/utilities/userTheme'
import { vergil } from 'vergil/plugins'

export default {
	extends: DefaultTheme,
	Layout: h(Vergil, {
		popup: true,
		confirm: true,
		toaster: true,
	}, () => h(Layout)),
	enhanceApp({ app }) {
		app
			.component('Demo', Demo)
			.component('Anatomy', Anatomy)
			.component('ColorPicker', () => h(ClientOnly, () => h(ColorPicker)))
			.use(vergil)
	}
}