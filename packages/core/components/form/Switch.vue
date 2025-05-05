<script setup lang="ts">
import Icon from '../Icon'
import FormField from '../private/FormField.vue'
import MiniMarkup from "../private/MiniMarkup"
import { vergil } from '../../vergil'
import { useDefineModel, useDefineElements } from '../../composables'
import { isValidRadius, isValidSize, isValidSpacing, isValidTheme, vPreventClickSelection } from '../../utilities'
import type { PropType } from 'vue'
import type { ModelValueProp, ModelValidatorProp, Elements, Theme, Size, Radius, Spacing } from '../../types'

defineOptions({ inheritAttrs: false })
const props = defineProps({
    //----- Initial value and model -----
    checked: Boolean,
    value: {
        type: [String, Boolean],
        default: undefined
    },
    valueOn: {
        type: [String, Boolean],
        default: (props: { value?: string | boolean }) => props.value ?? true
    },
    valueOff: {
        type: [String, Boolean],
        default: (props: { valueOn: string | boolean }) => (typeof props.valueOn === 'string') ? '' : false
    },
    modelValue: {
        type: [String, Boolean, Object] as ModelValueProp<boolean | string | string[]>,
        default: (props: { checked?: boolean, valueOn: string | boolean, valueOff: string | boolean }) => props.checked ? props.valueOn : props.valueOff,
    },
    ['onUpdate:modelValue']: Function,
    validator: Function as ModelValidatorProp<boolean | string | string[]>,
    eagerValidation: Boolean,
    elements: Object as PropType<Elements>,

    track: {
        type: String as PropType<'on' | 'off'>,
        validator: (v: string) => ['on','off'].includes(v)
    },
    labelOn: String,
    labelOff: String,
    highlight: Boolean,
    iconOn: String,
    iconOff: String,
    disabled: Boolean,
    class: [String, Object],

    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,
    showErrors: Boolean,
    
    //----- Global -----
    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.switch.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.switch.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.switch.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.switch.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})

const elements = useDefineElements(['input'])
const model = useDefineModel({ isCollection: true })

if (props.checked) {
    if (Array.isArray(model.value)) {
        if (!model.value.includes(props.valueOn)) {
            model.value.push(props.valueOn)
            model.triggerIfShallow()
        }
    } else if (model.value === props.valueOff) {
        model.value = props.valueOn
    }
}

model.onExternalUpdate(modelValue => {
    (elements.input as HTMLInputElement).checked = Array.isArray(modelValue)
        ? modelValue.includes(props.valueOn)
        : modelValue === props.valueOn
}, { onMounted: true })
const handleChange = model.updateDecorator((event: Event) => {
    if(Array.isArray(model.value)) {
        const idx = model.value.indexOf(props.valueOn)
        if(idx > -1) {
            if(!(event.target as HTMLInputElement).checked) {
                model.value.splice(idx, 1)
                model.triggerIfShallow()
                model.handleValidation(props.eagerValidation)
            }
        } else if((event.target as HTMLInputElement).checked) {
            model.value.push(props.valueOn)
            model.triggerIfShallow()
            model.handleValidation(props.eagerValidation)
        }
    } else {
        model.value = (event.target as HTMLInputElement).checked ? props.valueOn : props.valueOff
        model.handleValidation(props.eagerValidation)
    }
})
</script>

<template>
    <FormField :class="['switch', props.class]"
        :label :hint :description :help
        :theme :size :radius :spacing
        :showErrors :errors="model.errors"
    >
        <label :class="['switch-button', { [`track-${track}`]: track }]" v-prevent-click-selection>
            <input
                v-bind="$attrs"
                type="checkbox"
                :ref="elements.getRef('input')"
                :value="valueOn"
                :class="{ highlight }"
                :disabled
                @change="handleChange"
            >
            <label v-if="labelOff" class="switch-label-off">
                <MiniMarkup :str="labelOff"/>
            </label>
            <span :class="['switch-track', { invalid: model.error }]">
                <span class="switch-knob">
                    <Icon :code="iconOff" class="switch-icon-off"/>
                    <Icon :code="iconOn" class="switch-icon-on"/>
                </span>
            </span>
            <label v-if="labelOn" class="switch-label-on">
                <MiniMarkup :str="labelOn"/>
            </label>
        </label>
    </FormField>
</template>

<style>
.switch-button {
    font-size: var(--font-size);
    line-height: var(--line-height-text);
    display: flex;
    column-gap: var(--g-gap-md);
    border: none;
    color: var(--c-text);
    cursor: pointer;

    --c-switch-icon: var(--c-grey-solid-1);
    --c-label-highlight: var(--c-theme-text-1);
    --display-icon-off: initial;
    --display-icon-on: none;

    &:where(:not(.track-off)):has(> input:checked), &.track-on {
        --c-switch-icon: var(--c-theme-solid-1);
        & > .switch-track {
            background-color: var(--c-theme-solid-1);
            & > .switch-knob {
                background-color: var(--c-theme-text-4);
            }
        }
    }
    &:has(> input:checked) {
        --display-icon-off: none;
        --display-icon-on: initial;
        & > .switch-track > .switch-knob {
            left: var(--base);
        }
    }
    &:has(> input:disabled){
        --c-switch-icon: var(--c-disabled-1);
        --c-label-highlight: var(--c-disabled-text);

        color: var(--c-disabled-text);
        cursor: not-allowed;
        
        & > .switch-track {
            background-color: var(--c-disabled-1);
            box-shadow: none;
            & > .switch-knob {
                background-color: var(--c-disabled-border-3);
            }
        }
        &.track-on > .switch-track,
        &:not(.track-off):has(> input:checked) > .switch-track {
            background-color: var(--c-disabled-2);
        }
    }

    & > input[type="checkbox"] {
        appearance: none;
        pointer-events: none;
        position: absolute;
        margin: 0;
        opacity: 0;

        &:focus-visible ~ .switch-track {
            outline: 2px solid var(--c-theme-outline);
            outline-offset: 2px;
        }
        &.highlight {
            & ~ label { transition: color 150ms }
            & ~ .switch-label-off {
                color: var(--c-label-highlight);
            }
            & ~ .switch-label-on {
                color: rgb(from var(--c-grey-text-1) r g b / 0.65);
            }
            &:checked {
                & ~ .switch-label-off {
                    color: rgb(from var(--c-grey-text-1) r g b / 0.65);
                }
                & ~ .switch-label-on {
                    color: var(--c-label-highlight);
                }
            }
        }
    }
    & > .switch-track {
        --base: calc(1em * var(--font-size-scale-icon) * var(--line-height-icon));
        --ratio: 0.7;

        box-sizing: border-box;
        position: relative;
        display: flex;
        align-items: center;
        width: calc(var(--base) * 2);
        height: var(--base);
        border-width: calc(var(--base) * 0.5 * (1 - var(--ratio)));
        border-style: solid;
        border-color: transparent;
        border-radius: var(--g-radius-full, var(--g-radius-md));
        background-color: var(--c-grey-soft-4);
        transition: background-color 150ms;

        &.invalid {
            background-color: var(--c-theme-soft-4);
            box-shadow: 0 0 0 1px var(--c-theme-solid-1);
            & > .switch-knob {
                background-color: var(--c-theme-solid-1);
            }
        }
        & > .switch-knob {
            position: absolute;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            aspect-ratio: 1 / 1;
            border-radius: inherit;
            background-color: var(--c-grey-text-4);
            transition: left 150ms, background-color 150ms; 

            & > .icon {
                font-size: calc(0.9 * var(--ratio) * var(--base));
                color: var(--c-switch-icon);
                transition: color 150ms;
            }
            & > .switch-icon-off {
                display: var(--display-icon-off);
            }
            & > .switch-icon-on {
                display: var(--display-icon-on);
            }
        }
    }
}
</style>