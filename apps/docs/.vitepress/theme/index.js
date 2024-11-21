// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

import './styles/custom.css'
import './styles/overrides.css'

import Demo from './components/Demo.vue'
import Anatomy from './components/Anatomy.vue'
import { ColorPicker } from '@8ctavio/vergil/utilities/userTheme'
import { PopupBackdrop, PopoverPortal, Confirm, Toasters } from '@8ctavio/vergil/components'
import { h } from 'vue'
import { vergil } from '@8ctavio/vergil/plugins'

export default {
	extends: DefaultTheme,
	Layout: () => [
		h(Layout),
		h(PopupBackdrop),
		h(PopoverPortal),
		h(Confirm),
		h(Toasters)
	],
	enhanceApp({ app, router, siteData }) {
		app
			.component('Demo', Demo)
			.component('Anatomy', Anatomy)
			.component('ColorPicker', ColorPicker)
			.use(vergil)
	}
}
