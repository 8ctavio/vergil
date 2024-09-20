<script setup>
import Icon from "../Icon.vue"
import Btn from '../buttons/Btn.vue'
import ModalTransition from '../private/ModalTransition.vue'
import MiniMarkup from "../private/MiniMarkup.vue"
import { useTemplateRef, watch, nextTick } from "vue"
import { confirmModel } from "."
import { FocusTrap } from '../../utilities/private'

const focusTrap = new FocusTrap()

function resolveConfirm(response){
	confirmModel.show = false
	confirmModel.resolve(response)
	confirmModel.resolve = () => {}
	confirmModel.waitingConfirmation = false
}

const cancelBtn = useTemplateRef('cancel-btn')
const acceptBtn = useTemplateRef('accept-btn')
function handleKeyDown(event) {
	if(event.key === 'Escape') {
		resolveConfirm(false)
	} else {
		const isTabKey = event.key === 'Tab' && !(event.altKey || event.ctrlKey || event.metaKey)
		const focusedElement = document.activeElement
		if(isTabKey && focusedElement) {
			switch(event.target) {
				case cancelBtn.value.$el:
					event.preventDefault()
					acceptBtn.value.$el.focus()
					break
				case acceptBtn.value.$el:
					event.preventDefault()
					cancelBtn.value.$el.focus()
					break
			}
		}
	}
}

let focusedBeforeBlur = null
async function handleFocusOut(event) {
    if(event.relatedTarget === null) {
        await nextTick()
        focusedBeforeBlur = event.target
    }
}
function handleFocusIn(event) {
    if(focusTrap.isActive && ![cancelBtn.value.$el, acceptBtn.value.$el].includes(event.target)) {
        if(focusedBeforeBlur) {
            focusedBeforeBlur.focus()
            focusedBeforeBlur = null
        } else {
			cancelBtn.value.$el.focus()
		}
    }
}

let focusedBeforeTrap = null
watch(() => confirmModel.show, show => {
	if(show) {
		focusTrap.activate()
		focusedBeforeTrap = document.activeElement
		document.addEventListener('focusin', handleFocusIn)
		nextTick(() => cancelBtn.value.$el.focus())
	} else {
		document.removeEventListener('focusin', handleFocusIn)
		focusedBeforeTrap?.focus({ preventScroll: true })
		focusedBeforeTrap?.select?.()
		focusTrap.deactivate()
	}
})
</script>

<template>
	<ModalTransition :show="confirmModel.show" z-index="var(--z-index-confirm)">
		<div id="confirm-modal" :class="confirmModel.content.theme">
			<Icon :code="confirmModel.content.icon"/>
			<h1>{{ confirmModel.content.title }}</h1>
			<p v-if="confirmModel.content.description">
				<MiniMarkup :str="confirmModel.content.description"/>
			</p>
			<div @keydown="handleKeyDown" @focusout="handleFocusOut">
				<Btn ref="cancel-btn" variant="subtle" outline="subtle" theme="neutral" :label="confirmModel.content.declineLabel" @click="resolveConfirm(false)"/>
				<Btn ref="accept-btn" variant="solid" :theme="confirmModel.content.theme" :label="confirmModel.content.confirmLabel" @click="resolveConfirm(true)"/>
			</div>
		</div>
	</ModalTransition>
</template>

<style>
#confirm-modal{
	font-size: var(--font-size-md);
	display: grid;
	grid-template-columns: min-content auto;
	column-gap: 10px;
    row-gap: 15px;
	width: clamp(300px, 35%, 500px);
	padding: 20px;
	padding-left: calc(20px - var(--border-radius-lg));
	border-radius: var(--border-radius-lg);
	border-left: var(--border-radius-lg) solid var(--c-theme-1);
	background-color: var(--c-bg);
	box-shadow: 4px 4px 4px var(--c-box-shadow);

	& > .icon{
		font-size: 1.5em;
		line-height: normal;
        color: var(--c-theme-1);
        cursor: default;
        aspect-ratio: initial;
	}
	& > h1{
		font-size: 1.2em;
        align-self: center;
        font-weight: 600;
    }
	& > p{
		grid-column-start: 2;
        line-height: 1.5;
		word-wrap: break-word;
    }
	& > div{
		grid-column-start: 2;
		display: flex;
		justify-content: end;
		column-gap: 10px;
    }
}
.dark #confirm-modal{
    border: 1px solid var(--c-grey-soft-2);
	border-left: var(--border-radius-lg) solid var(--c-theme-1);
}
</style>