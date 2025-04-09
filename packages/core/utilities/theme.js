/** @import { Theme, ThemeAlias, Size, Radius, Spacing } from '../types' */

/**
 * @template { string } T
 * @overload
 * @param { T } theme
 * @returns { T extends 'brand' ? 'brand'
 *     : T extends 'user' ? 'user'
 *     : T extends ('ok' | 'success' | 'check') ? 'ok'
 *     : T extends ('info' | 'help' | 'tip') ? 'info'
 *     : T extends ('warn' | 'warning' | 'caution') ? 'warn'
 *     : T extends ('danger' | 'error') ? 'danger'
 *     : 'neutral'
 * }
 */

/**
 * Required for ReturnType<typeof inferTheme> to yield Theme.
 * @overload
 * @param { string } theme
 * @returns { Theme }
 */

/**
 * @param { string } theme 
 * @returns { Theme }
 */
export function inferTheme(theme) {
    if(theme === 'brand')
        return 'brand'
    if(theme === 'user')
        return 'user'
    if(theme === 'ok' || theme === 'success' || theme === 'check')
        return 'ok'    
    if(theme === 'info' || theme === 'help' || theme === 'tip')
        return 'info'
    if(theme === 'warn' || theme === 'warning' || theme === 'caution')
        return 'warn'
    if(theme === 'danger' || theme === 'error')
        return 'danger'
    return 'neutral'
}

/**
 * @typedef { {
 *     <T extends string>(value: T): T extends ThemeAlias ? true : false;
 *     (value: string): boolean;
 * } } IsValidTheme
 * @type { IsValidTheme }
 */
export const isValidTheme = Array.prototype.includes.bind([
    'brand',
    'user',
    'ok', 'success', 'check',
    'info', 'help', 'tip',
    'warn', 'warning', 'caution',
    'danger', 'error',
    'neutral'
])

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
export function isValidVariant(c,v){
    switch(c){
        case 'Btn':
            return ['solid', 'soft', 'subtle'].includes(v)
        case 'ToggleButton':
            return ['classic', 'card', 'list', 'toggle'].includes(v)
    }
}

/** @type { (value: string) => boolean }  */
export const isValidColor = Array.prototype.includes.bind(['cobalt', 'dartmouth', 'denim', 'emerald', 'grey', 'indigo', 'moss', 'red', 'sky', 'teal', 'wine', 'yellow'])
/** @type { (value: string) => boolean }  */
export const isValidPlacement = Array.prototype.includes.bind(['top','top-start','top-end','right','right-start','right-end','bottom','bottom-start','bottom-end','left','left-start','left-end'])