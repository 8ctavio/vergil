import { fileURLToPath, URL } from 'node:url'

// https://vitepress.vuejs.org/reference/site-config
export default {
	vite: {
		server: {
			port: 3000
		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('../src', import.meta.url)),
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
			{
				text: 'Get Started',
				link: '/get-started'
			},
			{
				text: 'Components',
				collapsed: false,
				items: [
					{ text: 'Alert', link: '/components/alert' },
					{
						text: 'Buttons',
						items: [
							{ text: 'Btn', link: '/components/buttons/btn' },
							{ text: 'Btn3D', link: '/components/buttons/btn3d' }
						]
					},
					{ text: 'Icon', link: '/components/icon' }
				]
			},
			{
				text: 'Form Components',
				collapsed: false,
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