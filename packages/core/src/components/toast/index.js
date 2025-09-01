import { reactive } from 'vue'
import { vergil } from '#vergil'
import { inferTheme } from "#utilities"

/**
 * @import { ToasterPosition, Theme } from '#types'
 */

const toasters = /**
    @type {(
        Record<ToasterPosition, {
            id: string;
            message: string;
            details: string;
            theme: Theme | undefined;
            icon: string | undefined;
            duration: number;
        }[]>
    )}
*/ (reactive({}))

/**
 * @typedef { object } ToastOptions
 * @property { ToasterPosition } [options.position]
 * @property { string } [options.message = '']
 * @property { string } [options.details = '']
 * @property { string } [options.theme]
 * @property { string } [options.icon]
 * @property { number } [options.duration]
 */

/**
 * @overload
 * @param { ToastOptions } options
 * @returns { void }
 */

/**
 * @overload
 * @param { string } message
 * @returns { void }
 */

/**
 * @overload
 * @param { string } theme
 * @param { string } message
 * @returns { void }
 */

/**
 * @param  { [ToastOptions] | [string] | [string, string] } args
 */
function toast(...args) {
    /** @type { Theme | undefined } */
    let theme
    /** @type { ToastOptions } */
    let options = {}
    if (args.length > 1) {
        theme = inferTheme(args[0])
        options.message = args[1]
    } else if (typeof args[0] === 'string') {
        options.message = args[0]
    } else {
        if (args[0]?.theme) theme = inferTheme(args[0].theme)
        options = args[0]
    }

    // @ts-expect-error
    const position = /** @type { ToasterPosition } */ (vergil.config.toaster.positions.includes(options?.position)
        ? options.position
        : vergil.config.toaster.positions.includes(vergil.config.toaster.position)
            ? vergil.config.toaster.position
            : vergil.config.toaster.positions[0])
    toasters[position]?.unshift({
        id: Date.now().toString(),
        message: options?.message ?? '',
        details: options?.details ?? '',
        theme,
        icon: options?.icon,
        duration: options?.duration ?? vergil.config.toaster.duration
    })
}

export {
    toasters,
    toast
}