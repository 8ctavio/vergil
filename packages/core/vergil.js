import { ref, readonly } from 'vue'
import isPlainObject from 'is-plain-obj'
import { inferTheme } from './utilities/private'

class Option{
    constructor(value, { modifier, validator }){
        this.default = value
        this.modifier = modifier
        this.validator = validator
    }
    resolve(v){
        if(!this.validator || this.validator(v)){
            return this.modifier ? this.modifier(v) : v
        }
        /** @todo log failed validation warn message */
        return this.default
    }
}

function updateConfig(config, options){
    for(const option in config){
        if(isPlainObject(config[option])){
            updateConfig(config[option], options?.[option])
        }
        else if(config[option] instanceof Option){
            if(option in (options ?? {})){
                config[option] = config[option].resolve(options[option])
            }
            else{
                config[option] = config[option].default
            }
        }
        else if(option in (options ?? {})){
            config[option] = options[option]
        }
    }
}

const vergil = {
    isReady: ref(false),
    config: {
        global: {
            theme: new Option('brand', { modifier: inferTheme }),
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
            theme: new Option(undefined, { modifier: inferTheme }),
            size: undefined,
            radius: undefined,
            spacing: undefined,
            squared: undefined
        },
        btn: {
            variant: 'solid',
            fill: undefined,
            borderless: undefined,
            theme: new Option(undefined, { modifier: inferTheme }),
            size: undefined,
            radius: undefined,
            spacing: undefined,
            squared: undefined
        },
        btn3D: {
            variant: 'solid',
            bordered: undefined,
            theme: new Option(undefined, { modifier: inferTheme }),
            size: undefined,
            radius: undefined,
            spacing: undefined,
            squared: undefined
        },
        checkbox: {
            theme: new Option(undefined, { modifier: inferTheme }),
            size: undefined,
            radius: undefined,
            spacing: undefined,
        },
        checkboxGroup: {
            theme: new Option(undefined, { modifier: inferTheme }),
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
            theme: new Option(undefined, { modifier: inferTheme }),
            size: undefined,
            radius: undefined,
            spacing: undefined,
        },
        popup: {
            theme: undefined,
        },
        radio: {
            theme: new Option(undefined, { modifier: inferTheme }),
            size: undefined,
            radius: 'full',
            spacing: undefined,
        },
        radioGroup: {
            theme: new Option(undefined, { modifier: inferTheme }),
            size: undefined,
            radius: 'full',
            spacing: undefined,
        },
        slider: {
            theme: new Option(undefined, { modifier: inferTheme }),
            size: undefined,
            radius: 'full',
            spacing: undefined,
        },
        switch: {
            theme: new Option(undefined, { modifier: inferTheme }),
            size: undefined,
            radius: 'full',
            spacing: undefined,
        },
        textarea: {
            underline: false,
            theme: new Option(undefined, { modifier: inferTheme }),
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
        }
    },
    updateConfig(options){
        updateConfig(vergil.config, options)
        vergil.isReady.value = true
    }
}
const vergilCopy = readonly(vergil)

export {
    vergilCopy as vergil
}