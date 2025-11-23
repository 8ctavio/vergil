import { vergil } from "@vrgl/vergil/plugins"

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.use(vergil)
})