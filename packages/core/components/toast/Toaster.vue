<template>
    <div id="toaster">
    </div>
</template>

<style>
#toaster{
    position: fixed;
    z-index: var(--z-index-toast);
}

.toast{
	position: fixed;
    right: 40px;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 10px;
	width: max-content;
	min-width: 200px;
	max-width: 600px;
	min-height: 40px;
	padding: 0 20px 0 10px;
	background-color: var(--gray1);
	border-radius: var(--borderRadius3);
	box-shadow: var(--boxShadow3);
	cursor: default;
    transition: bottom 500ms, opacity 400ms;
    animation-duration: 700ms;
    animation-timing-function: cubic-bezier(0.50, -0.30, 0.50, 1.30);

	font-size: 1rem;
}
.toast.enter{ animation-name: toastEnter; }
.toast.leave{
    animation-name: toastLeave;
    animation-fill-mode: forwards;    
}

@keyframes toastEnter{
    from{ bottom: -80px; }
    to{ bottom: 40px; }
}
@keyframes toastLeave{
    from{ bottom: 40px; }
    to{ bottom: -80px; }
}

.toast > span{
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 25px;
	color: var(--darkText);	
}
.toast.ok > span{ color: var(--green); }
.toast.error > span{ color: var(--red); }
.toast.warn > span{ color: #DEA82C; }
.toast.info > span{ color: var(--blue); }
.toast > p{
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 8px 0;
	font: 500 1.4em var(--mainFont);
	color: var(--darkText);
	letter-spacing: 1px;
}
</style>