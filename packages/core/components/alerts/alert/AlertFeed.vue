<template>
    <div id='alertFeed'>
    </div>
</template>

<style>
#alertFeed{
    position: fixed;
    z-index: 10;
}

.alert{
    position: fixed;
    margin: 0 auto;
    right: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    width: max-content;
    min-width: 300px;
    max-width: 700px;
    padding: 0 10px 0 12px;
    background-color: var(--gray1);
    border-radius: var(--borderRadius2);
    border-left: 3px solid var(--gray5);
    box-shadow: var(--boxShadow3);
    transition: top 500ms, opacity 400ms;
    animation-duration: 700ms;
    animation-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
    
    font-size: 1rem;
}
.alert.ok{ border-left-color: var(--green); }
.alert.error{ border-left-color: var(--red); }
.alert.warn{ border-left-color: var(--yellow); }
.alert.info{ border-left-color: var(--blue); }

.alert.enter{ animation-name: alertEnter; }
.alert.leave{
    animation-name: alertLeave;
    animation-fill-mode: forwards;    
}

@keyframes alertEnter{
    from{ top: -100px; }
    to{ top: 20px; }
}
@keyframes alertLeave{
    from{ top: 20px; }
    to{ top: -100px; }
}

.alert > span{
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: var(--borderRadius2);
    border-bottom-left-radius: var(--borderRadius2);
    font-size: 30px;
    color: var(--lightText);
}
.alert.ok > span{ color: var(--green); }
.alert.error > span{ color: var(--red); }
.alert.warn > span{ color: #DEA82C; }
.alert.info > span{ color: var(--blue); }

.alert p{
    justify-self: center;
    align-self: center;
    box-sizing: border-box;
    padding: 10px 0;
    font: 500 1.5em var(--mainFont);
    color: var(--darkText);
    letter-spacing: 1px;
    line-height: 22px;
	cursor: default;
}
.alert p b.inlineBlock{ display: inline-block; }

.alert button{
    display: flex;
    justify-content: center;
    align-items: center;
    border-style: none;
    border-radius: 100%;
    color: var(--gray4);
    cursor: pointer;
}
.alert button:hover{ color: var(--gray6); }
.alert button:focus{ outline: none; }

.alert button span{ transition: color 300ms; }
</style>