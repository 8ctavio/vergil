<script setup>
import { ref, onMounted } from 'vue';
import { useResizeObserver } from '@vueuse/core'

const { position, padding, size } = defineProps({
	label: String,
	position: {
		type: String,
		default: "absolute"
	},
	padding: {
		type: Number,
		default: 0
	},
	size: {
		type: String,
		default: "autosize"
	}
})
let normalPadding = "0px"
let customPadding1 = "0px"
let customPadding2 = "0px"
if(padding){
	if(position === 'absolute'){
		customPadding1 = "-"+padding+"px"
		customPadding2 = (padding*2)+"px"
	}
	else normalPadding = padding+"px"
}
const top = ref("0px")
const left = ref("0px")

const loader = ref(null)
const diameter = ref(0)
const borderWitdh = ref(0)
const animationDuration = ref(0)
onMounted(() => {
	if(size === 'autosize'){
		useResizeObserver(loader.value.parentNode, entries => {
			const entry = entries[0]
			const { blockSize, inlineSize } = entry.borderBoxSize[0]
			const minDimension = Math.min(blockSize, inlineSize)

			const computedStyles = getComputedStyle(loader.value)

			top.value = '-' + computedStyles.getPropertyValue('border-top-width')
			left.value = '-' + computedStyles.getPropertyValue('border-left-width')

			if(minDimension >= 60){
				borderWitdh.value = "4px"
				diameter.value = `${Math.floor(minDimension*0.70)}px`
			}
			else if(minDimension >= 55){
				borderWitdh.value = "3px"
				diameter.value = `${Math.floor(minDimension*0.70)}px`
			}
			else{
				borderWitdh.value = "3px"
				diameter.value = `${Math.floor(minDimension*0.80)}px`
			}
			animationDuration.value = "700ms"
		})
	}
	else if(size === 'md'){
		diameter.value = "80px"
		borderWitdh.value = "5px"
		animationDuration.value = "1s"
		top.value = `${loader.value.parentNode.scrollTop}px`
	}
	else if(size === 'lg'){
		diameter.value = "120px"
		borderWitdh.value = "5px"
		animationDuration.value = "1s"
		top.value = `${loader.value.parentNode.scrollTop}px`
	}
})
</script>

<template>
	<div class='loader' ref="loader">
		<span class="spinner"></span>
		<p class="info" v-if="label">
			{{ label }}
		</p>
	</div>
</template>

<style scoped>
#backdrop > .loader, .loader.screenLoader{ z-index: 8 }
.loader{
	box-sizing: content-box;
	position: v-bind(position);
	top: v-bind(top);
	left: v-bind(left);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: calc(100% + v-bind(customPadding2));
	height: calc(100% + v-bind(customPadding2));
	margin-top: v-bind(customPadding1);
	margin-left: v-bind(customPadding1);
	padding: v-bind(normalPadding);
	background-color: inherit;
	border-radius: inherit;
	border: inherit;
	z-index: 4;
}
.loader.screenLoader{
	position: fixed;
	background-color: #343A4040;
}
.loader.transparent{ background-color: transparent; }
.loader.translucent, .loader.screenLoader{ background-color: #343A4040;  }

.loader span{
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: var(--mainFont);

	box-sizing: border-box;
	border: v-bind(borderWitdh) solid white;
  	border-top: v-bind(borderWitdh) solid var(--c-brand-3);
  	border-radius: 50%;
  	width: v-bind(diameter);
  	height: v-bind(diameter);
  	animation: spin v-bind(animationDuration) linear infinite;
}

/*_______________________________________________________
_________________________ THEME _________________________
_______________________________________________________*/
.loader.translucent span, .loader.screenLoader span{
	border-color: var(--gray0);
	border-top-color: var(--brand-c);
}
.loader.alt span{
	border-color: #4950574A;
	border-top-color: var(--brand-c);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader.screenLoader > p{
	max-width: 40%;
	margin-top: 30px;
	font: 400 1.5rem var(--font2);
	padding: 10px 20px !important;
}

/*----------------------------------------------
-------------------- THEMES --------------------
----------------------------------------------*/
/*-------- BRAND --------*/
.loader.brand.primary{
	background-color: var(--c-brand-1);
}
.loader.brand.primary > .spinner{
	border-top-color: rgba(0 0 0 / 0.5);
}
.loader.brand.secondary{
	background-color: var(--c-brand-soft-1);
}
.loader.brand.secondary > .spinner{
	border-color: rgb(var(--rgb-brand) / 0.4);
	border-top-color: var(--c-brand-text-2);
}

/*-------- OK --------*/
.loader.ok.primary{
	background-color: var(--c-ok-1);
}
.loader.ok.primary > .spinner{
	border-top-color: rgba(0 0 0 / 0.5);
}
.loader.ok.secondary{
	background-color: var(--c-ok-soft-1);
}
.loader.ok.secondary > .spinner{
	border-color: rgb(var(--rgb-ok) / 0.4);
	border-top-color: var(--c-ok-text-2);
}

/*-------- INFO --------*/
.loader.info.primary{
	background-color: var(--c-info-1);
}
.loader.info.primary > .spinner{
	border-top-color: rgba(0 0 0 / 0.5);
}
.loader.info.secondary{
	background-color: var(--c-info-soft-1);
}
.loader.info.secondary > .spinner{
	border-color: rgb(var(--rgb-info) / 0.4);
	border-top-color: var(--c-info-text-2);
}

/*-------- WARN --------*/
.loader.warn.primary{
	background-color: var(--c-warn-1);
}
.loader.warn.primary > .spinner{
	border-top-color: rgba(0 0 0 / 0.5);
}
.loader.warn.secondary{
	background-color: var(--c-warn-soft-1);
}
.loader.warn.secondary > .spinner{
	border-color: var(--c-warn-2);
	border-top-color: var(--c-warn-text-2);
}

/*-------- DANGER --------*/
.loader.danger.primary{
	background-color: var(--c-danger-1);
}
.loader.danger.primary > .spinner{
	border-top-color: rgba(0 0 0 / 0.5);
}
.loader.danger.secondary{
	background-color: var(--c-danger-soft-1);
}
.loader.danger.secondary > .spinner{
	border-color: rgb(var(--rgb-danger) / 0.4);
	border-top-color: var(--c-danger-text-2);
}

/*-------- DANGER --------*/
.loader.gray.primary{
	background-color: var(--c-gray-1);
}
.loader.gray.primary > .spinner{
	border-top-color: rgba(0 0 0 / 0.5);
}
.loader.gray.secondary{
	background-color: var(--c-gray-soft-1);
}
.loader.gray.secondary > .spinner{
	border-color: rgb(var(--rgb-gray) / 0.3);
	border-top-color: var(--c-gray-text-2);
}
</style>