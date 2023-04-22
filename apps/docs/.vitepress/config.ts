import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/reference/site-config
export default defineConfig({
	vite: {
		server: {
			port: 3000
		},
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
		theme: 'dark-plus'
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
				text: 'UI Components',
				collapsed: false,
				items: [
					{ text: 'Alert', link: '/components/alert' },
					{ text: 'Toast', link: '/components/toast' },
					{ text: 'Confirm', link: '/components/confirm' },
				]
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/8ctavio/vergil' }
		]
	}
})