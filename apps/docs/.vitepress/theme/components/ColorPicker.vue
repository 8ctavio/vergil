<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { Btn } from '@8ctavio/vergil/components'
import { userThemeColor, setUserThemeColor } from '@8ctavio/vergil/userTheme'

const colors = ['moss', 'teal', 'sky', 'denim', 'indigo', 'wine']
</script>

<template>
    <div class="menu">
        <Menu>
            <MenuButton>
                <Btn variant="ghost" icon="style" size="lg" spacing="compact" radius="full"/>
            </MenuButton>
            <MenuItems class="menu-items">
                <MenuItem v-for="color in colors">
                    <button :class="['theme-color', color, { selected: userThemeColor === color }]" @click="setUserThemeColor(color)">
                        <span></span>
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    </div>
</template>

<style scoped>
.menu{
    align-self: center;
    position: relative;
}
.menu-items{
    position: absolute;
    top: 100%;
    right: 50%;
    transform: translateX(50%);
    display: grid;
    grid-template-columns: repeat(3,auto);
    gap: 2px;
    padding: 7px;
    border: 1px solid var(--c-grey-border-1);
    border-radius: var(--border-radius-md);
    background-color: var(--c-bg);
}

.theme-color{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: var(--border-radius-md);
    &:hover{
        background-color: var(--c-grey-soft-1);
    }
    &.selected{
        background-color: var(--c-grey-soft-2);
    }
    & > span{
        width: 10px;
        height: 10px;
        border-radius: 9999px;
    }
    &.moss{
        & > span{
            background-color: var(--c-moss-1);
        }
        &:hover > span{
            background-color: var(--c-moss-2);
        }
    }
    &.teal{
        & > span{
            background-color: var(--c-teal-1);
        }
        &:hover > span{
            background-color: var(--c-teal-2);
        }
    }
    &.sky{
        & > span{
            background-color: var(--c-sky-1);
        }
        &:hover > span{
            background-color: var(--c-sky-2);
        }
    }
    &.denim{
        & > span{
            background-color: var(--c-denim-1);
        }
        &:hover > span{
            background-color: var(--c-denim-2);
        }
    }
    &.indigo{
        & > span{
            background-color: var(--c-indigo-1);
        }
        &:hover > span{
            background-color: var(--c-indigo-2);
        }
    }
    &.wine{
        & > span{
            background-color: var(--c-wine-1);
        }
        &:hover > span{
            background-color: var(--c-wine-2);
        }
    }
}
</style>