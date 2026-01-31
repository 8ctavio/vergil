import { shallowReactive, triggerRef } from 'vue'
import { vergil } from '#vergil'
import { inferTheme } from "#utilities"

/**
 * @import { ShallowRef } from 'vue'
 * @import { ToasterPosition } from '#components'
 * @import { Theme } from '#utilities'
 */

export const toasters = /**
    @type {(
        Record<ToasterPosition, ShallowRef<{
            id: string;
            message: string;
            details: string;
            theme: Theme | undefined;
            icon: string | undefined;
            duration: number;
        }[]>>
    )}
*/ (shallowReactive({}))

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
export function toast(...args) {
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
    
    const toasterConfig = vergil.config.toaster
    const {
        position: _position,
        message = '',
        details = '',
        icon,
        duration = toasterConfig.duration
    } = options

    // @ts-expect-error
    const position = /** @type { ToasterPosition } */ (toasterConfig.positions.includes(_position)
        ? _position
        : toasterConfig.positions.includes(toasterConfig.position)
            ? toasterConfig.position
            : toasterConfig.positions[0])

    const toaster = toasters[position]
    if (toaster) {
        toaster.value.unshift({
            id: String(Date.now()),
            message,
            details,
            theme,
            icon,
            duration
        })
        triggerRef(toaster)
    }
}