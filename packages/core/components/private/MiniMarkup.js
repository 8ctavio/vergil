import Icon from '../Icon.vue'
import { h } from 'vue'

function parseMiniMarkup(str){
    if(!str) return []
    str = str.trim().replace(/[ \t]+/g, ' ').replace(/\n | \n/g, '\n')
	const reMarkPattern = /\*\*.*?\*\*|\/\/.*?\/\/|\[\[.*?\]\]|@@\S*?@@|\n/g
	const segments = []
	let start = 0
	let result
	while((result = reMarkPattern.exec(str)) !== null){
        if(start !== result.index){
            segments.push(str.slice(start, result.index))
        }
        segments.push(str.slice(result.index, reMarkPattern.lastIndex))
		start = reMarkPattern.lastIndex
	}
	if(start !== str.length){
		segments.push(str.slice(start))
	}
	return segments
}

const reBold = /^\*\*.*?\*\*$/
const reItalic = /^\/\/.*?\/\/$/
const reInlineBlock = /^\[\[.*?\]\]$/
const reIcon = /^@@\S*?@@$/

export default function MiniMarkup({ str = '' }) {
	const vnodes = []
	for(const segment of parseMiniMarkup(str)) {
		if(segment === '\n') {
			vnodes.push(h('br'))
		} else if(reBold.test(segment)) {
			vnodes.push(h('b', [
				h(MiniMarkup, { str: segment.slice(2,-2) })
			]))
		} else if(reItalic.test(segment)) {
			vnodes.push(h('i', [
				h(MiniMarkup, { str: segment.slice(2,-2) })
			]))
		} else if(reInlineBlock.test(segment)) {
			vnodes.push(h('span', { class: 'inline-block' }, [
				h(MiniMarkup, { str: segment.slice(2,-2) })
			]))
		} else if(reIcon.test(segment)) {
			vnodes.push(h(Icon, {
				class: 'inline-icon',
				code: segment.slice(2,-2)
			}))
		} else {
			vnodes.push(segment)
		}
	}
	return vnodes
}