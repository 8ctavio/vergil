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

export const isValidTheme = Array.prototype.includes.bind([
    'brand',
    'user',
    'ok', 'success', 'check',
    'info', 'help', 'tip',
    'warn', 'warning', 'caution',
    'danger', 'error',
    'neutral'
])
export const isValidRadius = Array.prototype.includes.bind(['none', 'sm', 'md', 'lg', 'full'])
export const isValidSize = Array.prototype.includes.bind(['xs', 'sm', 'md', 'lg', 'xl'])
export const isValidSpacing = Array.prototype.includes.bind(['', 'compact', 'expanded'])

export function isValidVariant(c,v){
    switch(c){
        case 'Btn':
            return ['solid', 'soft', 'subtle'].includes(v)
        case 'ToggleButton':
            return ['classic', 'card', 'list', 'toggle'].includes(v)
    }
}

export const isValidColor = Array.prototype.includes.bind(['cobalt', 'dartmouth', 'denim', 'emerald', 'grey', 'indigo', 'moss', 'red', 'sky', 'teal', 'wine', 'yellow'])
export const isValidPlacement = Array.prototype.includes.bind(['top','top-start','top-end','right','right-start','right-end','bottom','bottom-start','bottom-end','left','left-start','left-end'])