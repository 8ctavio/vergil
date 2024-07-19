import { fileURLToPath, URL } from 'node:url'

// https://vitepress.vuejs.org/reference/site-config
export default {
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
			dark: 'dark-plus'
		}
	},
	themeConfig: {
		// https://vitepress.vuejs.org/reference/default-theme-config
		siteTitle: "Vergil",
		logo: "/assets/vergil_glasses.png",

		nav: [
			{ text: 'Docs', link: '/get-started' }
		],

		sidebar: [
			{ text: 'Get Started', link: '/get-started' },
			{ text: 'Configuration', link: '/configuration' },
			{ text: 'Theme', link: '/theme' },
			{
				text: 'Components',
				collapsed: true,
				items: [
					{
						text: 'Buttons',
						items: [
							{ text: 'Btn', link: '/components/buttons/btn' },
							{ text: 'Btn3D', link: '/components/buttons/btn3d' }
						]
					},
					{ text: 'Confirm', link: '/components/confirm' },
					{ text: 'Icon', link: '/components/icon' },
					{ text: 'Popup', link: '/components/popup' },
					{ text: 'Toast', link: '/components/toast' },
				]
			},
			{
				text: 'Composables',
				collapsed: true,
				items: [
					{ text: 'extendedCustomRef', link: '/composables/extendedCustomRef' },
					{ text: 'extendedReactive', link: '/composables/extendedReactive' },
					{ text: 'extendedRef', link: '/composables/extendedRef' },
					{ text: 'resetRef', link: '/composables/resetRef' },
					{ text: 'waitFor', link: '/composables/waitFor' },
					{ text: 'watchUntil', link: '/composables/watchUntil' },
				]
			},
			{
				text: 'Utilities',
				collapsed: true,
				items: [
					{
						text: 'Functions',
						link: '/utilities/functions',
						items: [
							{ text: 'Server', link: '/utilities/server' },
						]
					},
					{ text: 'Regex', link: '/utilities/regex' }
				]
			},
			{
				text: 'Form Components',
				collapsed: true,
				items: [
					{ text: 'Checkbox', link: '/form-components/checkbox' },
					{ text: 'Radio Button', link: '/form-components/radio' },
					{ text: 'Slider', link: '/form-components/slider' },
					{ text: 'Switch', link: '/form-components/switch' },
				]
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/8ctavio/vergil' }
		]
	}
}