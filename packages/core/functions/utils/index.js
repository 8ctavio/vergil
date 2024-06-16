function isValidTheme(theme){
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

function inferTheme(theme){
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

const themeIcons = {
    brand: 'verified',
    user: 'verified',
    ok: 'check_circle',
    info: 'info',
    warn: 'warning',
    danger: 'cancel',
    neutral: 'info'
}

export {
    isValidTheme,
    inferTheme,
    themeIcons
}