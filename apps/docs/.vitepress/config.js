import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { version } from '../../../packages/vergil/package.json'

// https://vitepress.vuejs.org/reference/site-config
export default defineConfig({
	vite: {
		server: {
			port: 3000
		},
		resolve: {
			alias: {
				'@components': fileURLToPath(new URL('./theme/components', import.meta.url))
			}
		}
	},
	vue: {
		features: {
			optionsAPI: false
		}
	},
	markdown: {
		// https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes
		theme: {
			light: 'github-light',
			dark: 'vitesse-dark'
		}
	},
	srcDir: "./src",
	base: '/vergil/',
	cleanUrls: true,
	title: "Vergil",
	description: "Vue Components and Composition Utilities",
	head: [
		['link', {
			rel: 'icon',
			href: '/vergil/favicon.png'
		}]
	],
	themeConfig: {
		// https://vitepress.vuejs.org/reference/default-theme-config
		siteTitle: "Vergil",
		logo: {
			light: "/logo.svg",
			dark: "/logo-dark.svg",
			alt: "Vergil"
		},
		nav: [
			{ text: 'Docs', link: '/get-started' },
			{ text: `v${version}`, link: 'https://github.com/8ctavio/vergil/releases' },
			{
				component: 'ColorPicker',
				props: { position: 'fixed' }
			}
		],
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/8ctavio/vergil' }
		],
		search: {
			provider: 'algolia',
			options: {
				appId: 'PCGRD5D021',
				apiKey: 'c9e18b3af408039f26c81cc31eb7c66e',
				indexName: 'vergil-docs'
			}
		},

		sidebar: [
			{ text: 'Preface', link: '/preface' },
			{ text: 'Get Started', link: '/get-started' },
			{ text: 'Configuration', link: '/configuration' },
			{ text: 'Theme', link: '/theme' },
			{ text: 'Mini-Markup', link: '/mini-markup' },
			{
				text: 'Components',
				collapsed: true,
				items: [
					{ text: 'Badge', link: '/components/badge' },
					{
						text: 'Buttons',
						items: [
							{ text: 'Btn', link: '/components/buttons/btn' },
							{ text: 'Btn3D', link: '/components/buttons/btn3d' }
						]
					},
					{ text: 'Confirm', link: '/components/confirm' },
					{ text: 'DataList', link: '/components/datalist' },
					{ text: 'Icon', link: '/components/icon' },
					{ text: 'Modal', link: '/components/modal' },
					{ text: 'Placeholder', link: '/components/placeholder' },
					{ text: 'Skeleton', link: '/components/skeleton' },
					{ text: 'Toast', link: '/components/toast' },
					{ text: 'Tooltip', link: '/components/tooltip' },
					{ text: 'Vergil', link: '/components/vergil' },
				]
			},
			{
				text: 'Form Components',
				collapsed: true,
				items: [
					{ text: 'Introduction', link: '/components/form/introduction' },
					{ text: 'Calendar', link: '/components/form/calendar' },
					{ text: 'Checkbox', link: '/components/form/checkbox' },
					{ text: 'CheckboxGroup', link: '/components/form/checkboxGroup' },
					{ text: 'DatePicker', link: '/components/form/datePicker' },
					{ text: 'Form', link: '/components/form/Form' },
					{ text: 'InputNumber', link: '/components/form/inputNumber' },
					{ text: 'InputSearch', link: '/components/form/inputSearch' },
					{ text: 'InputText', link: '/components/form/inputText' },
					{ text: 'Radio', link: '/components/form/radio' },
					{ text: 'RadioGroup', link: '/components/form/radioGroup' },
					{ text: 'Select', link: '/components/form/select' },
					{ text: 'Slider', link: '/components/form/slider' },
					{ text: 'Switch', link: '/components/form/switch' },
					{ text: 'Textarea', link: '/components/form/textarea' },
				]
			},
			{
				text: 'Reactivity',
				collapsed: true,
				items: [
					{ text: 'entangled', link: '/reactivity/entangled' },
					{ text: 'extendedRef', link: '/reactivity/extendedRef' },
					{ text: 'resetRef', link: '/reactivity/resetRef' },
					{ text: 'waitFor', link: '/reactivity/waitFor' },
					{ text: 'watchControlled', link: '/reactivity/watchControlled' },
					{ text: 'watchUntil', link: '/reactivity/watchUntil' },
				]
			},
			{
				text: 'Composables',
				collapsed: true,
				items: [
					{ text: 'useDebounce', link: '/composables/useDebounce' },
					{ text: 'useElements', link: '/composables/useElements' },
					{ text: 'useExposed', link: '/composables/useExposed' },
					{ text: 'useModel', link: '/composables/useModel' },
					{ text: 'useModelGroup', link: '/composables/useModelGroup' },
					{ text: 'usePopover', link: '/composables/usePopover' },
					{ text: 'useWatchers', link: '/composables/useWatchers' },
					{
						text: 'Component Impl.',
						items: [
							{ text: 'useDefineElements', link: '/composables/useDefineElements' },
							{ text: 'useDefineExposed', link: '/composables/useDefineExposed' },
							{ text: 'useDefineModel', link: '/composables/useDefineModel' },
						]
					},
				]
			},
			{
				text: 'Functions',
				collapsed: true,
				items: [
					{ text: 'Descriptor', link: '/functions/descriptor' },
					{ text: 'Extended reactivity', link: '/functions/extendedReactivity' },
					{ text: 'Model', link: '/functions/model' },
					{ text: 'Utilities', link: '/functions/utilities' }
				]
			},
		]
	}
})