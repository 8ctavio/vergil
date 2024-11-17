import isPlainObject from 'is-plain-obj'
import { inferTheme } from './utilities/private'

class Option {
    constructor(value, modifier = v => v) {
        this.default = value
        this.modifier = modifier
    }
}

function createConfig(template, options = {}) {
    const descriptors = Object.create(null)
    for(const option in template) {
        if(isPlainObject(template[option])) {
            descriptors[option] = createConfig(template[option], options[option])
        } else {
            descriptors[option] = {
                configurable: false,
                enumerable: true,
                writable: true,
                value: Option.prototype.isPrototypeOf(template[option])
                    ? (option in options)
                        ? template[option].modifier(options[option])
                        : template[option].default
                    : (option in options)
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
            ghost: undefined,
            outline: undefined,
            underline: undefined,
            fill: undefined,
        },
        soft: {
            ghost: undefined,
            outline: undefined,
            underline: undefined,
            fill: undefined,
        },
        subtle: {
            ghost: undefined,
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
    inputSearch: {
        btnPosition: 'after',
    },
    inputText: {
        underline: false,
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    placeholder: {
        size: undefined,
        radius: undefined,
    },
    popover: {
        padding: 6,
        delay: 400
    },
    popup: {
        theme: undefined,
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
        theme: new Option(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    toast: {
        theme: undefined,
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
        placement: 'top',
        offset: 5,
    }
}