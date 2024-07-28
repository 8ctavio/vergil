import { ref, readonly } from 'vue'
import { vergil } from '../vergil'
import { isValidColor } from './functions/private/validators'

const cssVars = [
    '--c-user-1',
    '--c-user-2',
    '--c-user-3',
    '--rgb-user',
    '--c-user-soft-1',
    '--c-user-soft-2',
    '--c-user-soft-3',
    '--c-user-soft-4',
    '--rgb-user-soft',
    '--c-user-text-1',
    '--c-user-text-2',
    '--c-user-text-3',
    '--c-user-icon-1',
    '--c-user-icon-2',
    '--c-user-icon-3',
    '--c-user-border-1',
    '--c-user-border-2',
    '--c-user-border-3',
    '--c-user-border-4',
    '--c-user-outline'
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