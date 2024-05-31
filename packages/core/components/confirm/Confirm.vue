<script setup>
import Icon from "../Icon.vue"
import Btn from '../buttons/Btn.vue'
import { confirmModel } from "."

const resolveConfirm = response => {
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
					{{ confirmModel.content.description }}
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

	&.backdrop-enter-active{
		transition: opacity 200ms var(--bezier-sine-out);
		& > #confirm-modal{
			transition: opacity 300ms 200ms var(--bezier-sine-out), transform 500ms 200ms var(--bezier-bounce-out);
		}
	}
	&.backdrop-leave-active{
		transition: opacity 200ms 500ms var(--bezier-sine-in);
		& > #confirm-modal{
			transition: opacity 300ms 200ms var(--bezier-sine-in), transform 500ms var(--bezier-bounce-in);
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
	padding: 15px 20px;
	padding-left: calc(20px - var(--border-radius-lg));
	border-radius: var(--border-radius-lg);
	border-left: var(--border-radius-lg) solid var(--c-theme-1);
	background-color: var(--c-bg);
	box-shadow: 4px 4px 4px #50505050;

	& > .icon{
		font-size: 1.4em;
		line-height: normal;
        font-size: 1.5em;
        color: var(--c-theme-icon-3);
        cursor: default;
        aspect-ratio: initial;
	}
	& > h1{
		font-size: 1.4em;
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