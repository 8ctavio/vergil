import { fileURLToPath, URL } from 'node:url'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitepress.vuejs.org/reference/site-config
export default {
	vite: {
		plugins: [vueDevTools()],
		server: {
			port: 3000
		},
		resolve: {
			alias: {
				'@components': fileURLToPath(new URL('./theme/components', import.meta.url))
			}
		}
	},
	srcDir: "./src",
	title: "Vergil",
	description: "A Vue Web Application Development Framework",
	head: [
		['link', {
			rel: 'icon',
			type: 'image/x-icon',
			href: '/assets/vergil.ico'
		}]
	],
	markdown: {
		// https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes
		theme: {
			light: 'github-light',
			dark: 'vitesse-dark'
		}
	},
	themeConfig: {
		// https://vitepress.vuejs.org/reference/default-theme-config
		siteTitle: "Vergil",
		logo: "/assets/vergil_glasses.png",

		nav: [
			{ text: 'Docs', link: '/get-started' },
			{
				component: 'ColorPicker',
				props: {
					strategy: 'fixed'
				}
			}
		],

		sidebar: [
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
					{ text: 'Icon', link: '/components/icon' },
					{ text: 'Placeholder', link: '/components/placeholder' },
					{ text: 'Popup', link: '/components/popup' },
					{ text: 'Skeleton', link: '/components/skeleton' },
					{ text: 'Toast', link: '/components/toast' },
				]
			},
			{
				text: 'Form Components',
				collapsed: true,
				items: [
					{ text: 'Introduction', link: '/components/form/introduction' },
					{ text: 'Checkbox', link: '/components/form/checkbox' },
					{ text: 'CheckboxGroup', link: '/components/form/checkboxGroup' },
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
				text: 'Composables',
				collapsed: true,
				items: [
					{ text: 'defineReactiveProperties', link: '/composables/defineReactiveProperties' },
					{ text: 'extendedReactive', link: '/composables/extendedReactive' },
					{ text: 'extendedCustomRef', link: '/composables/extendedCustomRef' },
					{ text: 'extendedRef', link: '/composables/extendedRef' },
					{ text: 'resetRef', link: '/composables/resetRef' },
					{ text: 'useModel', link: '/composables/useModel' },
					{ text: 'usePopover', link: '/composables/usePopover' },
					{ text: 'waitFor', link: '/composables/waitFor' },
					{ text: 'watchControlled', link: '/composables/watchControlled' },
					{ text: 'watchUntil', link: '/composables/watchUntil' },
				]
			},
			{
				text: 'Utilities',
				collapsed: true,
				items: [
					{ text: 'Functions', link: '/utilities/functions' },
					{ text: 'Regex', link: '/utilities/regex' },
					{ text: 'Error handling', link: '/utilities/error-handling' },
				]
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/8ctavio/vergil' }
		]
	}
}