<script setup>
import Icon from "../../Icon.vue"

import { onMounted } from 'vue'
import { body, confirmContent, waitingConfirmation, resolveConfirm, open } from "."

onMounted(() => {
	body.value = document.querySelector('body')
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
	<Transition name="backdrop" :duration="{enter: 700}">
		<div v-if="open" id="confirmBackdrop">
			<main id="confirmDialog" :class="confirmContent.type" >
				<header>
					<Icon :code="confirmContent.icon ? confirmContent.icon : 'help'"/>
					<h1>
						{{ confirmContent.header }}
					</h1>
				</header>
				<div v-if="confirmContent.content" id='confirmContent'>
					{{ confirmContent.content }}
				</div>
				<div id='confirmBtns'>
					<button id='declineBtn' @click="handleResolveConfirm(false)" autofocus>{{ confirmContent.declineLabel }}</button>
					<button id='confirmBtn' @click="handleResolveConfirm(true)">{{ confirmContent.confirmLabel }}</button>
				</div>
			</main>
		</div>
	</Transition>
</template>

<style scoped>
#confirmBackdrop{
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: var(--backdrop-c);
	z-index: 9;	
}
@supports (backdrop-filter: none) or (-webkit-backdrop-filter: none) {
    #confirmBackdrop{
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
    }
}

.backdrop-enter-from,
.backdrop-leave-to{
	opacity: 0;
}
.backdrop-enter-active,
.backdrop-leave-active{
	transition: opacity 500ms ease;
}

#confirmDialog{
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
	z-index: 9;

	font-size: 1rem;
}

.backdrop-enter-from #confirmDialog,
.backdrop-leave-to #confirmDialog{
	opacity: 0;
	transform: translateY(calc(-50%));
}

.backdrop-enter-active #confirmDialog,
.backdrop-leave-active #confirmDialog{
	transition: opacity 500ms ease, transform 500ms ease;
}
.backdrop-enter-active #confirmDialog{
	transition-delay: 200ms;
}

#confirmDialog.danger{ border-left-color: var(--red); }
#confirmDialog.caution{ border-left-color: var(--yellow); }
#confirmDialog.ack{ border-left-color: var(--blue); }
#confirmDialog.check{ border-left-color: var(--green); }

#confirmDialog header{
	display: grid;
	grid-auto-flow: column;
	justify-content: start;
	align-items: center;
	gap: 20px;
	box-sizing: border-box;
}
#confirmDialog header h1{
	margin: 0;
	font: 700 2.5em var(--font2);
	color: var(--darkText);
	letter-spacing: 1px;
}
#confirmDialog header span{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	font-size: 3.5em;	
	color: var(--gray5)
}
#confirmDialog.danger header span{ color: var(--red); }
#confirmDialog.caution header span{ color: var(--yellow); }
#confirmDialog.ack header span{ color: var(--blue); }
#confirmDialog.check header span{ color: var(--green); }

#confirmContent{
	font: 400 1.6em var(--mainFont);
	text-align: start;
    cursor: default;
	line-height: 22px;
	letter-spacing: 1px;
	color: var(--darkText);
}

#confirmBtns{
    font-size: 1em;
	display: grid;
	grid-auto-flow: column;
	justify-content: end;
	gap: 20px;
	margin-top: 5px;
}
#confirmBtn, #declineBtn{
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

#confirmBtn{
	background-color: var(--gray5);
	color: var(--lightText);
}
#confirmDialog.danger #confirmBtn{ background-color: var(--red); }
#confirmDialog.caution #confirmBtn{ background-color: var(--yellow); }
#confirmDialog.ack #confirmBtn{ background-color: var(--blue); }
#confirmDialog.check #confirmBtn{ background-color: var(--green); }

#declineBtn{
	border: 1.5px solid var(--gray4);
	color: var(--darkText);
}

#confirmBtn:hover{ box-shadow: 0 2px 8px 3px var(--shadow3) }
#declineBtn:hover{ box-shadow: 0 2px 8px 3px var(--shadow2) }
</style>