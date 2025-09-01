import { shallowReactive } from 'vue'
import { vergil } from '#vergil'
import { inferTheme, noop } from "#utilities"

/**
 * @import { Theme } from '#types'
 */

const confirmModel = shallowReactive({
    show: false,
    content: /**
        @type {{
            theme: Theme;
            icon: string;
            title: string;
            description?: string;
            confirmLabel: string;
            declineLabel: string;
        }}
     */ ({}),
    waitingConfirmation: false,
    /** @type { (() => void) | ((response: boolean) => Promise<void>)  } */
    resolve: noop
})

/**
 * @param { string } theme
 * @param { object } request
 * @param { string } request.title
 * @param { string } [request.description]
 * @param { string } [request.confirmLabel]
 * @param { string } [request.declineLabel]
 * @param { string } [request.icon]
 * @param { () => void | Promise<void> } [request.onConfirmed]
 * @param { () => void | Promise<void> } [request.onDeclined]
 * @returns { Promise<null | boolean> }
 */
async function confirm(theme, {
    title,
    description,
    confirmLabel = vergil.config.confirm.confirmLabel,
    declineLabel = vergil.config.confirm.declineLabel,
    icon,
    onConfirmed = noop,
    onDeclined = noop
}) {
    theme = inferTheme(theme)
    if (!confirmModel.waitingConfirmation) {
        confirmModel.content = {
            theme: /** @type { Theme } */ (theme),
            icon: icon
                ?? vergil.config.confirm.icon[/** @type { Theme } */(theme)]
                ?? vergil.config.global.icon[/** @type { Theme } */(theme)],
            title,
            description,
            confirmLabel,
            declineLabel
        }
    }
    confirmModel.show = true

    return confirmModel.waitingConfirmation ? null : new Promise(resolve => {
        confirmModel.waitingConfirmation = true
        /** @param { boolean } response */
        confirmModel.resolve = async response => {
            if (response === true) {
                await onConfirmed()
            } else if (response === false) {
                await onDeclined()
            }
            resolve(response)
        }
    })
}

export {
    confirmModel,
    confirm
}