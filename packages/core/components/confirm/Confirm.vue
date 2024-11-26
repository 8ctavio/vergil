<script setup>
import Icon from "../Icon.vue"
import Btn from '../buttons/Btn.vue'
import ModalTransition from '../private/ModalTransition.vue'
import MiniMarkup from "../private/MiniMarkup"
import { useTemplateRef, watch, nextTick } from "vue"
import { vergil } from "../../vergil"
import { confirmModel } from "."
import { FocusTrap } from '../../utilities/private'
import { isValidRadius, isValidSize } from '../../utilities/private'

defineProps({
	size: {
        type: String,
        default: () => vergil.config.confirm.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.confirm.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    },
})

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
	if(event.key === 'Escape' && !(event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)) {
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
	<ModalTransition id="confirm-backdrop" :show="confirmModel.show">
		<div id="confirm-modal" :class="[confirmModel.content.theme, `size-${size} radius-${radius}`]">
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
#confirm-backdrop { z-index: var(--z-index-confirm) }
#confirm-modal {
	font-size: var(--font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-3xl);
	padding-left: calc(20px - var(--g-radius-lg));
    border-radius: var(--g-radius-lg);
	border-left: var(--g-radius-lg) solid var(--c-theme-1);

	display: grid;
	grid-template-columns: min-content auto;
	gap: calc(14 * var(--gap-unit)) calc(10 * var(--gap-unit));
	width: clamp(300px, 35%, 500px);
	background-color: var(--c-bg);
	box-shadow: 4px 4px 4px var(--c-box-shadow);

	& > .icon {
		font-size: 1.5em;
		line-height: normal;
        color: var(--c-theme-1);
        cursor: default;
        aspect-ratio: initial;
	}
	& > h1 {
		font-size: 1.2em;
        align-self: center;
        font-weight: 600;
    }
	& > p {
		grid-column-start: 2;
        line-height: 1.5;
		word-wrap: break-word;
    }
	& > div {
		grid-column-start: 2;
		display: flex;
		justify-content: end;
		column-gap: 10px;
    }
}
:root.dark #confirm-modal {
	border: 1px solid var(--c-grey-soft-2);
	border-left: var(--g-radius-lg) solid var(--c-theme-1);
}
</style>