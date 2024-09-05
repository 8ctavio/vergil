import { ref, readonly } from 'vue'
import { vergil } from '../vergil'
import { isValidColor } from './functions/private/validators'

const cssVars = [
    '--c-user-solid-1',
    '--c-user-solid-2',
    '--c-user-solid-3',
    '--c-user-soft-1',
    '--c-user-soft-2',
    '--c-user-soft-3',
    '--c-user-soft-4',
    '--c-user-icon',
    '--c-user-text-1',
    '--c-user-text-2',
    '--c-user-text-3',
    '--c-user-text-4',
    '--c-user-border-subtle',
    '--c-user-border-strong',
    '--c-user-border-solid',
    '--c-user-outline',
    '--c-user-1',
    '--c-user-2',
    '--c-user-3',
    '--rgb-user-solid',
    '--rgb-user-soft',
]

const userThemeColor = ref('')
const userThemeColorCopy = readonly(userThemeColor)
function setUserThemeColor(color){
    if(!isValidColor(color)) color = vergil.config.userTheme.default
    cssVars.forEach(v => {
        document.documentElement.style.setProperty(v, `var(${v.replace('user', color)})`)
    })
    localStorage.setItem('user-theme-color', color)
    userThemeColor.value = color
}

export {
    setUserThemeColor,
    userThemeColorCopy as userThemeColor
}