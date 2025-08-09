import { vergil } from '#vergil'
import { userThemeColor } from '@8ctavio/vergil/utilities/userTheme'

/** @import { PartialVergilConfig } from '../types' */

const plugin = {
    /**
     * @param { unknown } app 
     * @param { PartialVergilConfig } options 
     */
    install(app, options) {
        vergil.init(options)
        if (vergil.config.userTheme.enable && typeof globalThis.localStorage !== 'undefined') {
            userThemeColor.value = localStorage.getItem('user-theme-color') ?? vergil.config.userTheme.default
        }
    }
}
export { plugin as vergil }