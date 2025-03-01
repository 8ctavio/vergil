import { h } from 'vue'

function Icon({ code }, { slots }) {
	return h('span', {
		class: 'material-symbols-rounded icon'
	}, slots.default?.() ?? code)
}
Icon.props = { code: String }

export default Icon