import { h } from 'vue'

/**
 * @import { SetupContext } from 'vue'
 */

/**
 * @typedef { object } IconProps
 * @property { string } [code]
 * 
 * @param { IconProps } props
 * @param { SetupContext } ctx
 */
export default function Icon({ code }, { slots }) {
	return h('span', {
		class: 'material-symbols-rounded icon'
	}, slots.default?.() ?? code)
}
Icon.props = { code: String }