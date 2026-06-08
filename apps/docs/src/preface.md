# Preface

Vergil is a Vue component library developed as an attempt to address some DX concerns with component-related APIs that I have encountered in Vue and other component libraries; it is written to be the library whose API I would like to develop applications with.

It has been my general impression that the code or template required to interact with components could be made more concise, convenient, and intuitive in Vue. This is particularly the case for two kinds of APIs, which are both addressed by Vergil:

1. Common component public APIs; these include, for instance, how a `Select` component is provided with options or has multiple selection enabled.
2. Vue APIs to interact with custom components, such as the `v-model` directive for two-way data binding.

In addition to component-related APIs, Vergil includes several "general-purpose" composables and utility functions so that it serves as a more comprehensive toolkit for building web applications.

<br>

<blockquote>
Therefore, my beloved brothers, be steadfast, immovable, always abounding in the work of the Lord, knowing that in the Lord your labor is not in vain — 1 Corinthians 15:58
</blockquote>

<br>

<p :class="$style['text-right']">
	<i><a href="https://github.com/8ctavio" target="_blank" rel="noreferrer">Octavio Araiza</a></i>
	<br>
	<i>June, 2026</i>
</p>

<style module>
.text-right {
	text-align: right;
}
</style>

## Credits

Inspiration for feature implementation, UI design, API design, etc., was taken to different degrees from the following projects

- [Radix](https://www.radix-ui.com/)
- [Nuxt UI](https://ui.nuxt.com/)
- [PrimeVue](https://primevue.org/)
- [VueUse](https://vueuse.org/)
- [Vanilla Calendar Pro](https://vanilla-calendar.pro/)