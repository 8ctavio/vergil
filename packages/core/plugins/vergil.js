import { vergil } from '../vergil'
import { userThemeColor } from '../utilities/userTheme'

const plugin = {
    install(app, options) {
        vergil.init(options)
        if(vergil.config.userTheme.enable) {
            userThemeColor.value = localStorage.getItem('user-theme-color') ?? vergil.config.userTheme.default
        }
    }
}
export { plugin as vergil }