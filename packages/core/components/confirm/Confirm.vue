<script setup>
import Icon from "../Icon.vue"
import Btn from '../buttons/Btn.vue'
import MiniMarkup from "../MiniMarkup.vue"
import { confirmModel } from "."

function resolveConfirm(response){
	confirmModel.show = false
	confirmModel.resolve(response)
	confirmModel.resolve = () => {}
	confirmModel.waitingConfirmation = false
}
</script>

<template>
	<Transition name="backdrop" appear :duration="700">
		<div v-show="confirmModel.show" id="confirm-backdrop">
			<div id="confirm-modal" :class="confirmModel.content.theme">
				<Icon :code="confirmModel.content.icon"/>
				<h1>{{ confirmModel.content.title }}</h1>
				<p v-if="confirmModel.content.description">
					<MiniMarkup :str="confirmModel.content.description"/>
				</p>
				<div>
					<Btn variant="outline" theme="neutral" :label="confirmModel.content.declineLabel" @click="resolveConfirm(false)"/>
					<Btn variant="solid" :theme="confirmModel.content.theme" :label="confirmModel.content.confirmLabel" @click="resolveConfirm(true)"/>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style>
#confirm-backdrop{
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background-color: var(--c-backdrop);
    backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(2px);
	z-index: var(--z-index-confirm);

	--duration-backdrop-opacity: 100ms;
	--duration-confirm-opacity: 150ms;
	--duration-confirm-tranform: 400ms;

	&.backdrop-enter-active{
		transition: opacity var(--duration-backdrop-opacity) var(--bezier-sine-out);
		& > #confirm-modal{
			transition: opacity var(--duration-confirm-opacity) var(--duration-backdrop-opacity) var(--bezier-sine-out),
						transform var(--duration-confirm-tranform) var(--duration-backdrop-opacity) var(--bezier-bounce-out);
		}
	}
	&.backdrop-leave-active{
		transition: opacity var(--duration-backdrop-opacity) var(--duration-confirm-tranform) var(--bezier-sine-in);
		& > #confirm-modal{
			transition: opacity var(--duration-confirm-opacity) calc(var(--duration-confirm-tranform) - var(--duration-confirm-opacity)) var(--bezier-sine-in),
						transform var(--duration-confirm-tranform) var(--bezier-bounce-in);
		}
	}
	&:is(.backdrop-enter-from, .backdrop-leave-to){
		opacity: 0;
		& > #confirm-modal{
			opacity: 0;
			transform: translateY(-20%);
		}
	}
}

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
	box-shadow: 4px 4px 4px #50505050;

	& > .icon{
		font-size: 1.5em;
		line-height: normal;
        color: var(--c-theme-icon-3);
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
    box-shadow: 4px 4px 4px #00000070;
}
</style>