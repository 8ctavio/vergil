function isValidTheme(theme){
    return [
        'brand',
        'ok', 'success', 'check',
        'info', 'help', 'tip',
        'warn', 'warning', 'caution',
        'danger', 'error',
        'neutral'
    ].includes(theme)
}

function inferTheme(theme){
    if(['success', 'check'].includes(theme))
        return 'ok'    
    if(['help', 'tip'].includes(theme))
        return 'info'
    if(['warning', 'caution'].includes(theme))
        return 'warn'
    if(['error'].includes(theme))  
        return 'danger'  
    return theme
}

export {
    isValidTheme,
    inferTheme
}