<script setup>
import Icon from "../Icon.vue"
import Btn from '../buttons/Btn.vue'
import ModalTransition from '../utils/ModalTransition.vue'
import MiniMarkup from "../utils/MiniMarkup.vue"
import { confirmModel } from "."

function resolveConfirm(response){
	confirmModel.show = false
	confirmModel.resolve(response)
	confirmModel.resolve = () => {}
	confirmModel.waitingConfirmation = false
}
</script>

<template>
	<ModalTransition :show="confirmModel.show" z-index="var(--z-index-confirm)">
		<div id="confirm-modal" :class="confirmModel.content.theme">
			<Icon :code="confirmModel.content.icon"/>
			<h1>{{ confirmModel.content.title }}</h1>
			<p v-if="confirmModel.content.description">
				<MiniMarkup :str="confirmModel.content.description"/>
			</p>
			<div>
				<Btn variant="subtle" outline theme="neutral" :label="confirmModel.content.declineLabel" @click="resolveConfirm(false)"/>
				<Btn variant="solid" :theme="confirmModel.content.theme" :label="confirmModel.content.confirmLabel" @click="resolveConfirm(true)"/>
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
	border-left: var(--border-radius-lg) solid var(--c-theme-solid-1);
	background-color: var(--c-bg);
	box-shadow: 4px 4px 4px var(--c-box-shadow);

	& > .icon{
		font-size: 1.5em;
		line-height: normal;
        color: var(--c-theme-icon);
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
	border-left: var(--border-radius-lg) solid var(--c-theme-solid-1);
}
</style>