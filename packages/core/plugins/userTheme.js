import { ref, readonly } from 'vue'

const root = ref(null)

const colors = ['cobalt', 'dartmouth', 'denim', 'grey', 'indigo', 'moss', 'red', 'sky', 'teal', 'wine', 'yellow']
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
    if(typeof color !== 'string' || !colors.includes(color)) color = 'brand'
    cssVars.forEach(v => {
        root.value.style.setProperty(v, `var(${v.replace('user', color)})`)
    })
    localStorage.setItem('user-theme-color', color)
    userThemeColor.value = color
}

const userTheme = {
    install(app, options){
        root.value = document.documentElement
        const color = localStorage.getItem('user-theme-color') ?? 'brand'
        setUserThemeColor(color)
    }
}

export {
    userTheme,
    setUserThemeColor,
    userThemeColorCopy as userThemeColor
}