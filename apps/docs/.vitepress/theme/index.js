// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import './styles/custom.css'
import './styles/overrides.css'

import AppLayout from './components/AppLayout.vue'
import Demo from './components/Demo.vue'
import Anatomy from './components/Anatomy.vue'
import ColorPicker from './components/ColorPicker.vue'
import { vergil } from '@8ctavio/vergil/plugins'

export default {
	extends: DefaultTheme,
	Layout: AppLayout,
	enhanceApp({ app, router, siteData }) {
		app
			.component('Demo', Demo)
			.component('Anatomy', Anatomy)
			.component('ColorPicker', ColorPicker)
			.use(vergil)
	}
}
