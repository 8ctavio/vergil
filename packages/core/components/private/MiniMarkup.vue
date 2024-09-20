<script setup>
import MiniMarkup from './MiniMarkup.vue'
import Icon from '../Icon.vue'

const props = defineProps({
    str: {
        type: String,
        required: true,
        default: '',
    }
})

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
</script>

<template>
    <template v-for="segment in parseMiniMarkup(str)">
        <br v-if="segment === '\n'">
        <b v-else-if="reBold.test(segment)">
            <MiniMarkup :str="segment.slice(2,-2)"/>
        </b>
        <i v-else-if="reItalic.test(segment)">
            <MiniMarkup :str="segment.slice(2,-2)"/>
        </i>
        <span v-else-if="reInlineBlock.test(segment)" class="inline-block">
            <MiniMarkup :str="segment.slice(2,-2)"/>
        </span>
        <Icon v-else-if="reIcon.test(segment)" class="inline-icon" :code="segment.slice(2,-2)"/>
        <template v-else>{{ segment }}</template>
    </template>
</template>

<style>
.inline-block{ display: inline-block; }
.inline-icon {
    font-size: 1.2em;
    line-height: 0;
    vertical-align: -0.175em;
}
</style>