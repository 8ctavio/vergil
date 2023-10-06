<script setup>
import Backdrop from '../Backdrop.vue'
import Icon from "../Icon.vue"

import { onMounted } from 'vue'
import { body } from '../../utils/shared'
import { confirmContent, waitingConfirmation, resolveConfirm, open } from "."

onMounted(() => {
	if(body.value === null) body.value = document.querySelector('body')
})

const handleResolveConfirm = response => {
	open.value = false
	// body.value.classList.remove('prevent-overflow')
	resolveConfirm.value(response)
	resolveConfirm.value = () => {}
	waitingConfirmation.value = false
}
</script>

<template>
	<Backdrop v-show="open" z-index="var(--z-index-confirm)" :transition-duration="{enter: 700}">
		<div id="vergil-confirm" :class="confirmContent.type" >
			<header>
				<Icon :code="confirmContent.icon ? confirmContent.icon : 'help'"/>
				<h1>{{ confirmContent.header }}</h1>
			</header>
			<div v-if="confirmContent.content" class='confirmContent'>
				{{ confirmContent.content }}
			</div>
			<div class='confirmBtns'>
				<button class='declineBtn' @click="handleResolveConfirm(false)" autofocus>{{ confirmContent.declineLabel }}</button>
				<button class='confirmBtn' @click="handleResolveConfirm(true)">{{ confirmContent.confirmLabel }}</button>
			</div>
		</div>
	</Backdrop>
</template>

<style scoped>
#vergil-confirm{
	display: grid;
	grid-template-columns: 100%;
	gap: 20px;
	width: clamp(550px, 35%, 750px);
	padding: 20px;
	border-radius: var(--borderRadius2);
	border-left: 5px solid var(--gray5);
	background-color: var(--gray1);
	box-shadow: var(--boxShadow4);
	word-wrap: break-word;

	font-size: 1rem;
}

.backdrop-enter-from > #vergil-confirm,
.backdrop-leave-to > #vergil-confirm{
	opacity: 0;
	transform: translateY(calc(-50%));
}
.backdrop-enter-active > #vergil-confirm,
.backdrop-leave-active > #vergil-confirm{
	transition: opacity 500ms ease, transform 500ms ease;
}
.backdrop-enter-active > #vergil-confirm{
	transition-delay: 200ms;
}

#vergil-confirm.danger{ border-left-color: var(--red); }
#vergil-confirm.caution{ border-left-color: var(--yellow); }
#vergil-confirm.ack{ border-left-color: var(--blue); }
#vergil-confirm.check{ border-left-color: var(--green); }

#vergil-confirm header{
	display: grid;
	grid-auto-flow: column;
	justify-content: start;
	align-items: center;
	gap: 20px;
	box-sizing: border-box;
}
#vergil-confirm header h1{
	margin: 0;
	font: 700 2.5em var(--font2);
	color: var(--darkText);
	letter-spacing: 1px;
}
#vergil-confirm header span{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	font-size: 3.5em;	
	color: var(--gray5)
}
#vergil-confirm.danger header span{ color: var(--red); }
#vergil-confirm.caution header span{ color: var(--yellow); }
#vergil-confirm.ack header span{ color: var(--blue); }
#vergil-confirm.check header span{ color: var(--green); }

.confirmContent{
	font: 400 1.6em var(--mainFont);
	text-align: start;
    cursor: default;
	line-height: 22px;
	letter-spacing: 1px;
	color: var(--darkText);
}

.confirmBtns{
    font-size: 1em;
	display: grid;
	grid-auto-flow: column;
	justify-content: end;
	gap: 20px;
	margin-top: 5px;
}
.confirmBtn, .declineBtn{
	display: flex;
	align-items: center;
	padding: 5px 20px;
    background-color: var(--gray1);
	border-style: none;
	border-radius: var(--borderRadius2);
	font: 400 1.5em var(--font2);
    letter-spacing: 1px;
	cursor: pointer;
	transition: box-shadow 300ms;
	outline: none;
}

.confirmBtn{
	background-color: var(--gray5);
	color: var(--lightText);
}
#vergil-confirm.danger .confirmBtn{ background-color: var(--red); }
#vergil-confirm.caution .confirmBtn{ background-color: var(--yellow); }
#vergil-confirm.ack .confirmBtn{ background-color: var(--blue); }
#vergil-confirm.check .confirmBtn{ background-color: var(--green); }

.declineBtn{
	border: 1.5px solid var(--gray4);
	color: var(--darkText);
}

.confirmBtn:hover{ box-shadow: 0 2px 8px 3px var(--shadow3) }
.declineBtn:hover{ box-shadow: 0 2px 8px 3px var(--shadow2) }
</style>