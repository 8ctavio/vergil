export default defineNuxtConfig({
	app: {
		rootId: 'app'
    },
	components: [{
		path: "@/components",
		pathPrefix: false
	}],
	devtools: { enabled: true },
	compatibilityDate: "2025-10-25",
})