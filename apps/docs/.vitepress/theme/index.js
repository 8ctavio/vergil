// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import Demo from './components/Demo.vue'
import AppLayout from './components/AppLayout.vue'
import './styles/overrides.css'
import './styles/custom.css'

export default {
	extends: DefaultTheme,
	Layout: AppLayout,
	enhanceApp({ app, router, siteData }) {
		app.component('Demo', Demo)
	}
}
