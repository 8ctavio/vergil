import { shallowReactive } from 'vue'
import { vergil } from '../../vergil'
import { inferTheme, noop } from "../../utilities/private"

const confirmModel = shallowReactive({
    show: false,
    content: {},
    waitingConfirmation: false,
    resolve: noop
})

async function confirm(theme, {
    title,
    description,
    confirmLabel = vergil.config.confirm.confirmLabel,
    declineLabel = vergil.config.confirm.declineLabel,
    icon,
    onConfirmed = noop,
    onDeclined = noop
}){
    theme = inferTheme(theme)
    if(!confirmModel.waitingConfirmation){
        confirmModel.content = {
            theme,
            icon: icon ?? vergil.config.confirm.icon[theme] ?? vergil.config.global.icon[theme],
            title,
            description,
            confirmLabel,
            declineLabel
        }
    }
    confirmModel.show = true

    return confirmModel.waitingConfirmation ? null : new Promise(resolve => {
        confirmModel.waitingConfirmation = true
        confirmModel.resolve = async response => {
            if(response === true){
                await onConfirmed()
            } else if(response === false){
                await onDeclined()
            }
            resolve(response)
        }
    })
}

export{
    confirmModel,
    confirm
}