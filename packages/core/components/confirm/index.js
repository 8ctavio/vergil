import { shallowReactive } from 'vue'
import { inferTheme, themeIcons } from "../../functions/utils"

const confirmModel = shallowReactive({
    show: false,
    content: {},
    waitingConfirmation: false,
    resolve: () => {}
})

async function confirm(theme, {
    title,
    description,
    confirmLabel = 'Aceptar',
    declineLabel = 'Cancelar',
    icon
}){
    theme = inferTheme(theme)
    if(!confirmModel.waitingConfirmation){
        confirmModel.content = {
            theme,
            icon: icon ?? themeIcons[theme],
            title,
            description,
            confirmLabel,
            declineLabel
        }
    }
    confirmModel.show = true

    if(confirmModel.waitingConfirmation) return null

    return new Promise(resolve => {
        confirmModel.waitingConfirmation = true
        confirmModel.resolve = resolve
    })
}

export{
    confirmModel,
    confirm
}