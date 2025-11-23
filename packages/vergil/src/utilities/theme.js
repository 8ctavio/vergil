import { themes } from './private/theme.js'

/** @import { InferTheme, Theme, ThemeAlias, Size, Radius, Spacing } from '#utilities' */

/**
 * Returns the theme name of a given theme name or alias;
 * if there is no corresponding theme name, `'neutral'` is returned.
 * 
 * @template { string } T
 * @overload
 * @param { T } theme
 * @returns { InferTheme<T> extends never ? 'neutral' : InferTheme<T> }
 */

/**
 * @overload
 * @param { unknown } theme
 * @returns { Theme }
 * 
 * Required for ReturnType<typeof inferTheme> to yield Theme.
 */

/**
 * @param { unknown } themeAlias 
 * @returns { Theme }
 */
export function inferTheme(themeAlias) {
    for (const theme of Object.keys(themes)) {
        // @ts-expect-error
        if (theme === themeAlias || themes[theme]?.includes(themeAlias)) {
            return /** @type {Theme} */(theme)
        }
    }
    return 'neutral'
}

/**
 * @template { string } T
 * @overload
 * @param { T } value
 * @returns { T extends ThemeAlias ? true : false }
 */

/**
 * @param { unknown } value
 * @returns { boolean }
 */
export function isValidTheme(value) {
    for (const theme of Object.keys(themes)) {
        // @ts-expect-error
        if (theme === value || themes[theme]?.includes(value)) {
            return true
        }
    }
    return false
}

/**
 * @typedef { {
 *     <T extends string>(value: T): T extends Radius ? true : false;
 *     (value: string): boolean;
 * } } IsValidRadius
 * @type { IsValidRadius }
 */
export const isValidRadius = Array.prototype.includes.bind(['none', 'sm', 'md', 'lg', 'full'])
/**
 * @typedef { {
 *     <T extends string>(value: T): T extends Size ? true : false;
 *     (value: string): boolean;
 * } } IsValidSize
 * @type { IsValidSize }
 */
export const isValidSize = Array.prototype.includes.bind(['xs', 'sm', 'md', 'lg', 'xl'])
/**
 * @typedef { {
 *     <T extends string>(value: T): T extends Spacing ? true : false;
 *     (value: string): boolean;
 * } } IsValidSpacing
 * @type { IsValidSpacing }
 */
export const isValidSpacing = Array.prototype.includes.bind(['', 'compact', 'expanded'])


/**
 * @param { 'Btn' | 'ToggleButton' } c
 * @param { string } v
 */
export function isValidVariant(c, v) {
    switch (c) {
        case 'Btn':
            return ['solid', 'soft', 'subtle'].includes(v)
        case 'ToggleButton':
            return ['classic', 'card', 'list', 'toggle'].includes(v)
    }
}

/** @type { (value: string) => boolean }  */
export const isValidColor = Array.prototype.includes.bind(['cobalt', 'dartmouth', 'denim', 'emerald', 'grey', 'indigo', 'moss', 'red', 'sky', 'teal', 'wine', 'yellow'])
/** @type { (value: string) => boolean }  */
export const isValidPlacement = Array.prototype.includes.bind(['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end'])