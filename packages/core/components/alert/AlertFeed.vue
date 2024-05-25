<template>
    <div id='alert-feed'>
    </div>
</template>

<style>
#alert-feed{
    position: fixed;
    z-index: var(--z-index-alert);
}

.alert{
    position: fixed;
    margin: 0 auto;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    width: max-content;
    min-width: 300px;
    max-width: 700px;
    padding: 0 7px 0 10px;
    background-color: white;
    border-radius: var(--border-radius-md);
    border-left: 4px solid var(--c-theme-1);
    box-shadow: 3px 3px 3px #60606045;
    transition: top 500ms, opacity 400ms;
    animation-duration: 700ms;
    animation-timing-function: cubic-bezier(0.50, -0.40, 0.50, 1.40);
    
    font-size: 1rem;
}

.alert.enter{ animation-name: alertEnter; }
.alert.leave{
    animation-name: alertLeave;
    animation-fill-mode: forwards;    
}

@keyframes alertEnter{
    from{ top: -100px; }
    to{ top: 15px; }
}
@keyframes alertLeave{
    from{ top: 15px; }
    to{ top: -100px; }
}

.alert > span{
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: var(--borderRadius2);
    border-bottom-left-radius: var(--borderRadius2);
    font-size: 27px;
    color: var(--c-theme-2);
}

.alert p{
    font-size: var(--font-size-md);
    font-weight: 500;
    justify-self: center;
    align-self: center;
    box-sizing: border-box;
    padding: 12px 0;
    color: var(--darkText);
    letter-spacing: 0.5px;
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
    color: var(--c-grey-soft-3);
    cursor: pointer;
}
.alert button:hover{ color: var(--c-grey-soft-4); }
.alert button:focus{ outline: none; }

.alert button span{
    font-size: 20px;
    transition: color 300ms;
}
</style>