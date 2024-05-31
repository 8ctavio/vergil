import { ref } from 'vue'
import { inferTheme, themeIcons } from "../../utils"

const alertFeed = ref([])
function alert(theme, msg_opt, duration = 6){
    theme = inferTheme(theme)
    alertFeed.value.unshift({
        id: Date.now().toString(),
        message: typeof msg_opt === 'string' ? msg_opt : msg_opt.message,
        details: msg_opt.details ?? '',
        theme,
        icon: msg_opt.icon ?? themeIcons[theme],
        duration: msg_opt.duration ?? duration
    })
}

export {
    alertFeed,
    alert
}