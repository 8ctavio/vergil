import { vergil } from "@8ctavio/vergil/plugins"

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.use(vergil)
})