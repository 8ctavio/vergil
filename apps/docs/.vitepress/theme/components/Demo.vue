<template>
    <div class="demo">
        <slot/>
    </div>
</template>

<style scoped>
.demo{
    display: flex;
    align-items: center;
    min-height: 100px;
    border-radius: 8px;
    background-color: var(--vp-c-bg-alt);
}

.demo :is(.row, .col){
    display: grid;
    width: 100%;
    gap: 15px;
    padding: 30px;
}
.demo :is(.row, .col) > :is(.row, .col){
    padding: 0;
}
.demo :slotted(.row){
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
.demo :slotted(:is(.row, .col).center){
    justify-items: center;
}
</style>