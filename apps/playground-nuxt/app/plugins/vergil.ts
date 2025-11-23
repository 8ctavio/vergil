import { vergil } from "vergil/plugins"

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.use(vergil)
})