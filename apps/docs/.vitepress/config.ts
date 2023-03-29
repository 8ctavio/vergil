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
		theme: 'poimandres' //'vitesse-dark'
	},
	themeConfig: {
		// https://vitepress.vuejs.org/reference/default-theme-config
		siteTitle: "Vergil",
		logo: "/assets/vergil_glasses.png",

		nav: [
			{ text: 'Docs', link: '/alert' }
		],

		sidebar: [
			{
				text: 'UI Components',
				items: [
					{ text: 'Alert', link: '/alert' },
					{ text: 'Toast', link: '/toast' },
					{ text: 'Confirm', link: '/confirm' },
				]
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/8ctavio/vergil' }
		]
	}
})