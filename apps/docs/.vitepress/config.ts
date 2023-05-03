import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

// https://vitepress.vuejs.org/reference/site-config
export default defineConfig({
	vite: {
		server: {
			port: 3000
		},
		resolve: {
			alias: {
				'@@': fileURLToPath(new URL('./theme/components', import.meta.url))
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
					{ text: 'Pop-up', link: '/components/pop-up' },
				]
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/8ctavio/vergil' }
		]
	}
})