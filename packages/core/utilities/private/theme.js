export function inferTheme(theme){
    if(['brand'].includes(theme))
        return 'brand'
    if(['user'].includes(theme))
        return 'user'
    if(['ok', 'success', 'check'].includes(theme))
        return 'ok'    
    if(['info', 'help', 'tip'].includes(theme))
        return 'info'
    if(['warn', 'warning', 'caution'].includes(theme))
        return 'warn'
    if(['danger', 'error'].includes(theme))  
        return 'danger'
    return 'neutral'
}

export const isValidColor = v => ['cobalt', 'dartmouth', 'denim', 'emerald', 'grey', 'indigo', 'moss', 'red', 'sky', 'teal', 'wine', 'yellow'].includes(v)
export const isValidRadius = v => ['none', 'sm', 'md', 'lg', 'full'].includes(v)
export const isValidSize = v => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
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
            return ['classic', 'card', 'list', 'toggle'].includes(v)
    }
}

export const isValidPlacement = v => ['top','top-start','top-end','right','right-start','right-end','bottom','bottom-start','bottom-end','left','left-start','left-end'].includes(v)