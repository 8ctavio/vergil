import { ref } from 'vue'
import { inferTheme } from "../../utils"

const toastIcons = {
    brand: 'verified',
    ok: 'check_circle',
    info: 'info',
    warn: 'warning',
    danger: 'cancel',
    neutral: 'info'
}

const toaster = ref([])
function toast(theme, msg_opt, duration = 6){
    theme = inferTheme(theme)
    toaster.value.unshift({
        id: Date.now().toString(),
        message: typeof msg_opt === 'string' ? msg_opt : msg_opt.message,
        details: msg_opt.details ?? '',
        theme,
        icon: msg_opt.icon ?? toastIcons[theme],
        duration: msg_opt.duration ?? duration
    })
}

export {
    toastIcons,
    toaster,
    toast
}