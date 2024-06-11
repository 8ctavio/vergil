function getServerErrorMessage(operation, code, causes){
    return {
        title: {
            '<operation>': '<Message title>'
        }[operation],
        details: [code, ...causes].reduce((obj, key) => typeof obj === 'object' ? obj[key ?? 'default'] : obj, {
            '<code>': {
                '<cause>': "<Message details>",
                '<cause>': {
                    '<cause>': "<Message details>",
                    default: "<Message details>"
                },
                default: "<Message details>"
            }
        }) + '.'
    }
}