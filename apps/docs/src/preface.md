# Preface

I have been using Vue (v3) for about four years, and I have enjoyed it thus far. However, I have not always been satisfied with some component-related APIs from a DX point of view (this complaint will be shown to be mainly subjective; by no means do I intend to suggest that the implicated APIs are deficient, but simply that I have occasionally wanted for some of them to be different).

The APIs I have in mind are of two kinds: First, Vue APIs to interact with custom components, such as the `v-model` directive for two-way data binding. Secondly, public APIs of common components from some popular Vue component/UI libraries I have used; for a `Select` component, for instance, these may include how are options provided, how is multiple selection enabled, etc.

I tend to get the impression that the code or template required to interact with components in some instances could be made simpler, or more ergonomic, or more intuitive, or more compact, or more convenient, or a combination of those. Vergil, which is fundamentally a Vue component library, is my attempt to address these concerns.

I am writing Vergil to be the library whose API I would like to develop applications with. Furthermore, in addition to reimagined component-related APIs, Vergil also includes several "general purpose" composables and utility functions so that it serves as a more comprehensive toolkit to build web applications.

Vergil has been developed addressing somewhat specific use cases, and its concern is not flexibility to target requirements for all or most types of applications (as might be the case of other libraries). As such, Vergil's scope might be rather limited, but that does not imply that it could not be further extended. However, in accordance with my initial motivation, it will be unlikely for changes that compromise the DX of existing APIs to be introduced.

Although Vergil is still early in development, I would like to share its progress now. I would appreciate your thoughts and feedback on Vergil, so please, feel free to share them.

<br>

<blockquote>
Whatever you do, work heartily, as for the Lord and not for men — Colossians 3:23
</blockquote>

<br>

<p :class="$style['text-right']">
	<i><a href="https://github.com/8ctavio" target="_blank" rel="noreferrer">Octavio Araiza</a></i>
	<br>
	<i>May, 2025</i>
</p>

<style module>
.text-right {
	text-align: right;
}
.source {

}
</style>

## Credits

Inspiration for feature implementation, UI design, API design, etc., was taken to different degrees from the following projects

- [Radix](https://www.radix-ui.com/)
- [Nuxt UI](https://ui.nuxt.com/)
- [PrimeVue](https://primevue.org/)
- [VueUse](https://vueuse.org/)
- [Vanilla Calendar Pro](https://vanilla-calendar.pro/)