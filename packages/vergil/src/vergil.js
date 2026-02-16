import { inferTheme, isObject, isPlainObject } from '#utilities'

/** @import { VergilConfig, PartialVergilConfig } from '#vergil' */

/**
 * @param { Record<string, unknown> } template 
 * @param { Record<string, unknown> } [options = {}] 
 * @returns { {
 *     value: Record<string, unknown>;
 *     configurable: false;
 *     enumerable: true;
 *     writable: false;
 * } }
 */
function createConfig(template, options = {}) {
    const descriptors = /** @type { Record<string, object> } */({})
    for (const option of Object.keys(template)) {
        if (isPlainObject(template[option])) {
            descriptors[option] = createConfig(
                /** @type { Record<string, unknown> } */ (template[option]),
                /** @type { Record<string, unknown> | undefined } */ (options[option])
            )
        } else {
            descriptors[option] = {
                configurable: false,
                enumerable: true,
                writable: true,
                value: hasModifier(template[option])
                    ? Object.hasOwn(options, option)
                        ? /** @type { OptionWithModifier } */(template[option]).modifier(options[option])
                        : /** @type { OptionWithModifier } */(template[option]).default
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

/**
 * @type { {
 *     config: VergilConfig;
 *     init(options?: PartialVergilConfig): void
 * } }
 */
export const vergil = Object.defineProperties(/** @type { typeof vergil } */ ({}), {
    config: {
        value: null,
        writable: true,
        enumerable: true,
        configurable: false,
    },
    init: {
        /** @param { Record<string, unknown> } [options] */
        value(options) {
            if (vergil.config === null) {
                Object.defineProperty(
                    vergil,
                    'config',
                    createConfig(template, options)
                )
                // @ts-expect-error
                template = null
            }
        }
    }
})

/**
 * @template [T=unknown]
 * @typedef { {
 *     default: T;
 *     modifier(value: unknown): T;
 *     [Symbol.toStringTag]: 'OptionWithModifier';
 * } } OptionWithModifier
 */

/**
 * @template V
 * @template { (...args: any) => any } M
 * @param { V } value
 * @param { M } modifier
 * @returns { OptionWithModifier<V | ReturnType<M>> }
 */
function withModifier(value, modifier) {
    return {
        default: value,
        modifier,
        [Symbol.toStringTag]: 'OptionWithModifier'
    }
}

/**
 * @template T
 * @param { T } option
 * @returns { options is T extends OptionWithModifier ? T : never }
 */
function hasModifier(option) {
    return isObject(option)
        && /** @type { Record<PropertyKey, unknown> } */ (option)[Symbol.toStringTag] === 'OptionWithModifier'
}

/**
 * @template { object } T
 * @typedef { {
 *     [K in keyof T]: T[K] extends object
 *         ? T[K] extends Function
 *             ? T[K] | OptionWithModifier<T[K]>
 *             : MayHaveModifier<T[K]>
 *         : T[K] | OptionWithModifier<T[K]>
 * } } MayHaveModifier
 */

/**
 * @typedef { { [K in keyof VergilConfig]: MayHaveModifier<VergilConfig[K]> } } VergilConfigSpec
 * @type { VergilConfigSpec }
 */
let template = {
    global: {
        validationDelay: 300,
        validationCooldown: 350,
        theme: withModifier('brand', inferTheme),
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
        theme: withModifier(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
        squared: undefined
    },
    button: {
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
        theme: withModifier(undefined, inferTheme),
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
        theme: withModifier(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    checkbox: {
        variant: 'classic',
        theme: withModifier(undefined, inferTheme),
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
        theme: withModifier(undefined, inferTheme),
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
        theme: withModifier(undefined, inferTheme),
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
        buttonPosition: 'after',
    },
    inputText: {
        underline: false,
        validationDelay: undefined,
        validationCooldown: undefined,
        theme: withModifier(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    modal: {
        theme: undefined,
        size: undefined,
        radius: undefined,
    },
    placeholder: {
        theme: withModifier(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
    },
    popover: {
        padding: 6,
        delay: 400
    },
    pushButton: {
        variant: 'solid',
        soft: {
            outline: undefined
        },
        subtle: {
            outline: undefined
        },
        theme: withModifier(undefined, inferTheme),
        size: undefined,
        radius: undefined,
        spacing: undefined,
        squared: undefined
    },
    radio: {
        variant: 'classic',
        radioRadius: 'full',
        theme: withModifier(undefined, inferTheme),
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
        theme: withModifier(undefined, inferTheme),
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
        theme: withModifier(undefined, inferTheme),
        size: undefined,
        radius: 'full',
        spacing: undefined,
    },
    switch: {
        theme: withModifier(undefined, inferTheme),
        size: undefined,
        radius: 'full',
        spacing: undefined,
    },
    textarea: {
        underline: false,
        validationDelay: undefined,
        theme: withModifier(undefined, inferTheme),
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