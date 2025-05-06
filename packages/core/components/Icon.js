import { h } from 'vue'

/**
 * @import { FunctionalComponent } from 'vue'
 */

/**
 * @typedef { object } IconProps
 * @property { string } [code]
 * 
 * @typedef { FunctionalComponent<IconProps> } IconFC
 * @typedef { Parameters<IconFC> } IconParams
 * 
 * @param { IconParams[0] } props
 * @param { IconParams[1] } ctx
 * @returns { ReturnType<IconFC> }
 */
export default function Icon({ code }, { slots }) {
	return h('span', {
		class: 'material-symbols-rounded icon'
	}, slots.default?.() ?? code)
}
Icon.props = { code: String }