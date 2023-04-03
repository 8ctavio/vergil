<script setup>
import Icon from "../../Icon.vue"
import { confirmContent } from "."
</script>

<template>
    <div id='confirm' :class="confirmContent.style">
        <div>
			<header>
				<Icon :code="confirmContent.icon"/>
				<h1>
					{{ confirmContent.header }}
				</h1>
			</header>
            <div v-if="confirmContent.body" id='confirmContent'>
				{{ confirmContent.body }}
			</div>
            <div id='confirmBtns'>
                <button id='declineBtn'>{{ confirmContent.secBtnTxt }}</button>
                <button id='acceptBtn'>{{ confirmContent.priBtnTxt }}</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
#confirm{
	position: fixed;
	top: 0;
	left: 0;
	display: none;
	opacity: 0;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background-color: var(--blockBackColor);
	z-index: 9;
	transition: opacity 300ms, backdrop-filter 300ms;
}
@supports (backdrop-filter: none) or (-webkit-backdrop-filter: none) {
    #confirm{
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
    }
}

#confirm.ok > div{ border-left-color: var(--green); }
#confirm.error > div{ border-left-color: var(--red); }
#confirm.warn > div{ border-left-color: var(--yellow); }
#confirm.info > div{ border-left-color: var(--blue); }
#confirm > div{
    font-size: 1rem;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: 100%;
	width: clamp(550px, 35%, 750px);
	gap: 20px;
	padding: 20px;
 	border-radius: var(--borderRadius2);
    background-color: var(--gray1);
	border-left: 5px solid var(--gray5);
	box-shadow: var(--boxShadow4);
	transform: translateY(calc(-50%));
	word-wrap: break-word;
	transition: transform 500ms ease;
}
#confirm > div.animation{  transform: translateY(0) !important; }

#confirm > div header{
	display: grid;
	grid-auto-flow: column;
	justify-content: start;
	align-items: center;
	gap: 20px;
	box-sizing: border-box;
}
#confirm > div header h1{
	margin: 0;
	font: 700 2.5em var(--font2);
	color: var(--darkText);
	letter-spacing: 1px;
}
#confirm.ok > div header span{ color: var(--green); }
#confirm.error > div header span{ color: var(--red); }
#confirm.warn > div header span{ color: var(--yellow); }
#confirm.info > div header span{ color: var(--blue); }
#confirm > div header span{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	font-size: 3.5em;	
	color: var(--gray5)
}

#confirmContent{
	font: 400 1.6em var(--mainFont);
	text-align: start;
    cursor: default;
	line-height: 22px;
	letter-spacing: 1px;
}
#confirmContent b.inlineBlock{ display: inline-block; }
#confirmContent i{
	font-size: 0.9em;
	color: var(--gray8);	
}

#confirmContent > div{
    font-size: calc(5em / 9);
    position: relative;
    align-self: center;
	width: 300px;
	margin-top: 20px;
}
#confirmContent > div > input{
    box-sizing: border-box;
	position: relative;
	width: min-content;
	padding: 4px 10px;
	border-style: none;
	border-bottom: 2px solid var(--yellow);
	border-radius: 3px;
	font: 400 1.5em var(--mainFont);
	letter-spacing: 0.5px;
	transition: box-shadow 300ms;
	z-index: 2;
}
#confirmContent > div > input:hover{	
	box-shadow: 5px 5px 2px rgba(0,0,0,0.3);
}
#confirmContent > div > p{
	position: absolute;
	bottom: 0;
	left: 5px;
	margin: 0;
	padding: 0;
	font: Bold 12px Consolas;
	color: var(--red);
	transition: transform 500ms;
	z-index: 1;
}
#confirmContent :deep(*).inlineBlock{ display: inline-block; }

#confirmBtns{
    font-size: 1em;
	display: grid;
	grid-auto-flow: column;
	justify-content: end;
	gap: 20px;
}
#acceptBtn, #declineBtn{
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

#confirm.ok #acceptBtn{ background-color: var(--green); }
#confirm.error #acceptBtn{ background-color: var(--red); }
#confirm.warn #acceptBtn{ background-color: var(--yellow); }
#confirm.info #acceptBtn{ background-color: var(--blue); }
#acceptBtn{
	background-color: var(--gray5);
	color: var(--lightText);
}

#declineBtn{
	border: 1.5px solid var(--gray4);
	color: var(--darkText);
}

#acceptBtn:hover{ box-shadow: 0 2px 8px 3px var(--shadow3) }
#declineBtn:hover{ box-shadow: 0 2px 8px 3px var(--shadow2) }
</style>