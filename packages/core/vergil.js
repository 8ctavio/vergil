import { inferTheme, isObject, isPlainObject } from './utilities'

class Option {
    constructor(value, modifier = v => v) {
        this.default = value
        this.modifier = modifier
    }
}
function isOption(o) {
    return isObject(o) && Object.getPrototypeOf(o) === Option.prototype
}

function createConfig(template, options = {}) {
    const descriptors = Object.create(null)
    for(const option of Object.keys(template)) {
        if(isPlainObject(template[option])) {
            descriptors[option] = createConfig(template[option], options[option])
        } else {
            descriptors[option] = {
                configurable: false,
                enumerable: true,
                writable: true,
                value: isOption(template[option])
                    ? Object.hasOwn(options, option)
                        ? template[option].modifier(options[option])
                        : template[option].default
                    : Object.hasOwn(options, option)
                        ? options[option]
                        : template[option]
            }
        }
    }
    return {
        value: Object.defineProperties({}, descriptors),
        configurable: false,
        enumerable: true,
        writable: false,
    }
}

export const vergil = Object.create(null, {
    config: {
        value: null,
        writable: true,
        enumerable: true,
        configurable: false,
    },
    init: {
        value(options) {
            if(vergil.config === null) {
                Object.defineProperty(
                    vergil,
                    'config',
                    createConfig(template, options)
                )
                template = null
            }
        }
    }
})

let template = {
    global: {
        validationDelay: 300,
        validationCooldown: 350,
        theme: new Option('brand', inferTheme),
        size: 'md',
        radius: 'md',
        spacing: '',
        icon: {
            brand: 'verified',
            user: 'verified',
            ok: 'check_circle',
            info: 'info',
            warn: 'warning',
            danger: 'cancel',
            neutral: 'info'
        }
    },
    userTheme: {
        enable: true,
        default: 'moss'
    },
    badge: {
        variant: 'soft',
        soft: {
            outline: undefined
        },
        subtle: {
            outline: undefined
        },
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
        squared: undefined
    },
    btn: {
        variant: 'solid',
        solid: {
            mask: undefined,
            outline: undefined,
            underline: undefined,
            fill: undefined,
        },
        soft: {
            mask: undefined,
            outline: undefined,
            underline: undefined,
            fill: undefined,
        },
        subtle: {
            mask: undefined,
            outline: undefined,
            underline: undefined,
            fill: undefined,
        },
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
        squared: undefined
    },
    btn3D: {
        variant: 'solid',
        soft: {
            outline: undefined
        },
        subtle: {
            outline: undefined
        },
        bordered: undefined,
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
        squared: undefined
    },
    calendar: {
        locale: 'en',
        labels: undefined,
        firstWeekday: 0,
        timeFormat: '24',
        validationDelay: undefined,
        validationCooldown: undefined,
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    checkbox: {
        variant: 'classic',
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    confirm: {
        confirmLabel: 'Accept',
        declineLabel: 'Cancel',
        size: undefined,
        radius: undefined,
        icon: {
            brand:undefined,
            user: undefined,
            ok: undefined,
            info: undefined,
            warn: undefined,
            danger: undefined,
            neutral: undefined
        }
    },
    datalist: {
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    datePicker: {
        format: undefined,
        formatOptions: undefined,
        placeholderFallback: n => `${n} Dates Selected`,
        sideButtonPosition: 'after',
        underline: undefined,
        fill: undefined,
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    form: {
        validationCooldown: undefined,
    },
    inputNumber: {
        validationDelay: undefined,
        validationCooldown: undefined,
    },
    inputSearch: {
        btnPosition: 'after',
    },
    inputText: {
        underline: false,
        validationDelay: undefined,
        validationCooldown: undefined,
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    placeholder: {
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    popover: {
        padding: 6,
        delay: 400
    },
    popup: {
        theme: undefined,
        size: undefined,
        radius: undefined,
    },
    radio: {
        variant: 'classic',
        radioRadius: 'full',
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    select: {
        placeholderFallback: n => `${n} Selected`,
        placeholderNotFound: query => `No results for [["${query}"]]`,
        placeholderFilter: 'Filter',
        underline: undefined,
        fill: undefined,
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    skeleton: {
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    slider: {
        validationDelay: undefined,
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: 'full',
        spacing: undefined,
    },
    switch: {
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: 'full',
        spacing: undefined,
    },
    textarea: {
        underline: false,
        validationDelay: undefined,
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    toast: {
        theme: undefined,
        size: undefined,
        radius: undefined,
        icon: {
            brand: undefined,
            user: undefined,
            ok: undefined,
            info: undefined,
            warn: undefined,
            danger: undefined,
            neutral: undefined
        }
    },
    toaster: {
        positions: ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end'],
        position: 'bottom-end',
        duration: 6
    },
    tooltip: {
        arrow: false,
        offset: arrow => arrow ? 2 : 5,
        placement: 'top',
    }
}