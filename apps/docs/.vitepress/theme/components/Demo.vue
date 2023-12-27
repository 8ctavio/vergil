<template>
    <div class="demo center">
        <slot/>
    </div>
</template>

<style scoped>
.demo{
    justify-content: center;
    font-size: 1rem;
    font-family: var(--font-main);

    min-height: 80px;
    margin: 16px 0;
    padding: 20px;

    background-color: var(--c-bg-alt);
    /* background-color: var(--c-bg); */
    
    border-radius: 8px;
}

.demo, :slotted(.row){
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 15px;
    width: 100%;
}
:slotted(.row).center{
    justify-content: center;
}
:slotted(.col){
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}
:slotted(.col).center{
    align-items: center;
}
</style>