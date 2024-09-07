export const isValidColor = v => ['cobalt', 'dartmouth', 'denim', 'grey', 'indigo', 'moss', 'red', 'sky', 'teal', 'wine', 'yellow'].includes(v)
export const isValidRadius = v => ['none', 'sm', 'md', 'lg', 'full'].includes(v)
export const isValidSize = v => ['sm', 'md', 'lg', 'xl'].includes(v)
export const isValidSpacing = v => ['', 'compact', 'expanded'].includes(v)
export function isValidTheme(theme){
    return [
        'brand',
        'user',
        'ok', 'success', 'check',
        'info', 'help', 'tip',
        'warn', 'warning', 'caution',
        'danger', 'error',
        'neutral'
    ].includes(theme)
}
export function isValidVariant(c,v){
    switch(c){
        case 'Btn':
            return ['solid', 'soft', 'subtle'].includes(v)
        case 'ToggleButton':
            return ['classic', 'card', 'toggle', 'list'].includes(v)
    }
}