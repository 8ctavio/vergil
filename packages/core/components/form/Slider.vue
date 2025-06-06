<script setup lang="ts">
import FormField from '../internal/FormField.vue'
import MiniMarkup from "../internal/MiniMarkup"
import { computed } from 'vue'
import { vergil } from '../../vergil'
import { useDefineModel, useDefineElements } from '../../composables'
import { isFunction, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities'
import type { PropType } from 'vue'
import type { ModelValueProp, ModelValidatorProp, Elements, Theme, Size, Radius, Spacing } from '../../types'

defineOptions({ inheritAttrs: false })
const props = defineProps({
    //----- Initial value and model -----
    min: {
        type: [String, Number],
        default: '0'
    },
    max: {
        type: [String, Number],
        default: '100',
        validator: (max, { min }) => Number(max) > Number(min)
    },
    virtualMin: {
        type: Number,
        validator: (v: number, { min }) => v > Number(min)
    },
    virtualMax: {
        type: Number,
        validator(virtualMax: number, { virtualMin, max }) {
            return virtualMax < Number(max) && (typeof virtualMin !== 'number' || virtualMax > virtualMin) 
        }
    },
    value: {
        type: [String, Number],
        default: (props: { virtualMin?: number, min: string | number }) => props.virtualMin ?? props.min,
        validator(v, props) {
            return Number(v) >= Number(props.virtualMin ?? props.min) && Number(v) <= Number(props.virtualMax ?? props.max)
        }
    },
    modelValue: {
        type: [Number, Object] as ModelValueProp<number>,
        default: (props: { value: string | number }) => Number(props.value),
    },
    ['onUpdate:modelValue']: Function,
    validator: Function as ModelValidatorProp<number>,
    eagerValidation: Boolean,
    elements: Object as PropType<Elements>,

    displayValue: [Boolean, Function] as PropType<boolean | ((value: number) => string)>,
    fixedProgress: Boolean,
    disabled: Boolean,
    class: [String, Object],
    
    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,
    showErrors: Boolean,

    //----- Debounced validation -----
    validationDelay: {
        type: Number,
        default: () => vergil.config.slider.validationDelay ?? vergil.config.global.validationDelay,
    },
    
    //----- Global -----
    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.slider.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.slider.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: () => vergil.config.slider.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.slider.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})

const model = useDefineModel<number>()
const elements = useDefineElements(['input'])

model.onExternalUpdate(modelValue => {
    (elements.input as HTMLInputElement).value = modelValue.toString()
}, { onMounted: true })

const validateInput = model.useDebouncedValidation(props.validationDelay)
const handleInput = model.updateDecorator((event: Event) => {
    const newValue = Number((event.target as HTMLInputElement).value)
    if(props.virtualMin && newValue < props.virtualMin) {
        model.value = props.virtualMin
    } else if(props.virtualMax && newValue > props.virtualMax) {
        model.value = props.virtualMax
    } else {
        model.value = newValue
    }
    validateInput(props.eagerValidation)
})

// @ts-expect-error
const sliderProgress = computed(() => (model.value - props.min)/(props.max - props.min))
const valueWidth = computed(() => String(props.max).length)
</script>

<template>
    <FormField :class="['slider', props.class]"
        :label :hint :description :help
        :theme :size :radius :spacing
        :showErrors :errors="model.errors"
    >
        <div class="slider-outer">
            <div :class="['slider-wrapper', { fixedProgress }]">
                <span>&ZeroWidthSpace;</span>
                <input
                    v-bind="$attrs"
                    type="range"
                    :ref="elements.getRef('input')"
                    :min
                    :max
                    :disabled
                    @input="handleInput"
                >
                <span :class="['slider-track', { invalid: model.error }]">
                    <span class="slider-progress">
                        <span class="slider-knob"/>
                    </span>
                </span>
            </div>
            <p v-if="displayValue" class="slider-value">
                <MiniMarkup :str="(isFunction(props.displayValue)) ? props.displayValue(model.value) : model.value.toString()"/>
            </p>
        </div>
    </FormField>
</template>

<style>
.form-field.slider.size-xs > .slider-outer > .slider-wrapper,
.size-xs .form-field.slider > .slider-outer > .slider-wrapper {
    --track-height: 2.5px;
    --knob-radius: 5px;
}
.form-field.slider.size-sm > .slider-outer > .slider-wrapper,
.size-sm .form-field.slider > .slider-outer > .slider-wrapper {
    --track-height: 3.5px;
    --knob-radius: 6px;
}
.form-field.slider.size-md > .slider-outer > .slider-wrapper,
.size-md .form-field.slider > .slider-outer > .slider-wrapper {
    --track-height: 5px;
    --knob-radius: 7px;
}
.form-field.slider.size-lg > .slider-outer > .slider-wrapper,
.size-lg .form-field.slider > .slider-outer > .slider-wrapper {
    --track-height: 6.5px;
    --knob-radius: 9px;
}
.form-field.slider.size-xl > .slider-outer > .slider-wrapper,
.size-xl .form-field.slider > .slider-outer > .slider-wrapper {
    --track-height: 7px;
    --knob-radius: 9.5px;
}
.slider-outer {
    font-size: var(--font-size);
    line-height: var(--line-height-text);
    display: flex;
    column-gap: var(--g-gap-2xl);
    width: 100%;
    padding: var(--g-gap-md) 0;
    color: var(--c-text);

    &:has(> .slider-wrapper > input[type="range"]:disabled) {
        color: var(--c-disabled-text);
    }
    & > .slider-wrapper {
        --knob-diameter: calc(2 * var(--knob-radius));
        --fixed-progress: 0%;

        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        border-radius: var(--g-radius-full, var(--g-radius-md));

        &.fixedProgress {
            --fixed-progress: 15%;
        }
        &:has(> input[type="range"]:focus-visible) {
            outline: 2px solid var(--c-theme-outline);
            outline-offset: 2px;
        }
        & > input[type="range"] {
            appearance: none;
            width: 100%;
            height: 0;
            margin: 0;
            margin-left: var(--fixed-progress);
            opacity: 0;
            cursor: pointer;
            z-index: 1;

            &:not(:disabled):hover + .slider-track > .slider-progress > .slider-knob {
                box-shadow: 0 0 0 calc(1em * 10/14 * 0.6) var(--c-theme-border-subtle);
            }
            &:not(:disabled):active + .slider-track > .slider-progress > .slider-knob {
                box-shadow: 0 0 0 calc(1em * 10/14 * 0.9) var(--c-theme-border-subtle);
            }
            &:disabled {
                cursor: not-allowed;
                & + .slider-track {
                    background-color: var(--c-disabled-1);
                    & > .slider-progress {
                        background-color: var(--c-disabled-border-2);
                        & > .slider-knob {
                            background-color: var(--c-disabled-border-3);
                        }
                    }
                }
            }
        }
        & > .slider-track {
            position: absolute;
            left: 0;
            width: 100%;
            height: var(--track-height);
            border-radius: inherit;
            background-color: var(--c-grey-soft-4);

            &.invalid {
                background-color: var(--c-theme-soft-4);
            }
            & > .slider-progress {
                position: absolute;
                left: 0;
                display: flex;
                align-items: center;
                height: 100%;
                border-radius: inherit;
                width: calc(var(--knob-radius) + var(--fixed-progress) + v-bind(sliderProgress) * (100% - var(--knob-diameter) - var(--fixed-progress)));
                background-color: var(--c-theme-solid-1);
                & > .slider-knob {
                    position: absolute;
                    left: 100%;
                    transform: translateX(-50%);
                    height: var(--knob-diameter);
                    aspect-ratio: 1 / 1;
                    border-radius: var(--g-radius-full, var(--g-radius-md));
                    background-color: var(--c-theme-1);
                    transition: box-shadow 150ms;
                }
            }
        }
    }
    & > .slider-value {
        width: calc(1em * (10/14) * v-bind(valueWidth));
        min-width: max-content;
        text-align: center;
        cursor: default;
    }
}
</style>