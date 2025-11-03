export default defineNuxtConfig({
	devtools: { enabled: true },
	components: [{
		path: "@/components",
		pathPrefix: false
	}],
	compatibilityDate: "2025-10-25"
})