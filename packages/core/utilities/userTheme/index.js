import { customRef } from 'vue'
import { vergil } from '../../vergil'
import { isValidColor } from '../private'

const cssVars = [
    '--c-user-solid-1',
    '--c-user-solid-2',
    '--c-user-solid-3',
    '--c-user-soft-1',
    '--c-user-soft-2',
    '--c-user-soft-3',
    '--c-user-soft-4',
    '--c-user-text-1',
    '--c-user-text-2',
    '--c-user-text-3',
    '--c-user-text-4',
    '--c-user-border-subtle',
    '--c-user-border-regular',
    '--c-user-outline',
    '--c-user-1',
    '--c-user-2',
    '--c-user-3',
    '--c-user-4',
]

export const userThemeColor = customRef((track, trigger) => {
    let color = ''
    return {
        get() {
            track()
            return color
        },
        set(c) {
            if(!isValidColor(c)) {
                c = vergil.config.userTheme.default
            }
            if(color !== c) {
                cssVars.forEach(v => {
                    document.documentElement.style.setProperty(v, `var(${v.replace('user', c)})`)
                })
                localStorage.setItem('user-theme-color', c)
                color = c
                trigger()
            }
        }
    }
})

export { default as ColorPicker } from './ColorPicker.vue'