<script setup>
import FormField from '../utils/FormField.vue'
import MiniMarkup from "../utils/MiniMarkup.vue"
import { computed } from 'vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
defineEmits(['update:modelValue'])

const props = defineProps({
    //----- Initial value and model -----
    min: {
        type: String,
        default: '0'
    },
    max: {
        type: String,
        default: '100'
    },
    value: {
        type: String,
        default: props => props.min,
        validator: (v, props) => Number(v) >= Number(props.min) && Number(v) <= Number(props.max)
    },
    modelValue: {
        default: props => useModel(Number(props.value)),
        validator: isModel
    },

    //----- Component specific -----
    displayValue: {
        type: [Boolean, Function]
    },
    fixedProgress: Boolean,
    
    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,

    //----- Appearance -----
    theme: {
        type: String,
        default: () => vergil.config.slider.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.slider.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.slider.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: () => vergil.config.slider.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    disabled: Boolean,
    class: [String, Object]
})

const model = useModel(props.modelValue)

const sliderProgress = computed(() => (model.value - props.min)/(props.max - props.min))
const valueWidth = computed(() => props.max.length)
</script>

<template>
    <FormField :class="['slider', props.class]"
        :label :hint :description :help
        :size :radius :spacing
        >
        <div class="slider-outer">
            <div
                :class="['slider-wrapper', inferTheme(theme), { fixedProgress }]">
                <span>&ZeroWidthSpace;</span>
                <input
                    v-bind="$attrs"
                    v-model.number="model.value"
                    :ref="model.getRef('el')"
                    type="range"
                    :min
                    :max
                    :disabled
                    >
                <span class="slider-track">
                    <span class="slider-progress">
                        <span class="slider-knob"/>
                    </span>
                </span>
            </div>
            <p v-if="displayValue" class="slider-value">
                <MiniMarkup :str="(typeof props.displayValue === 'function') ? props.displayValue(model.value) : model.value.toString()"/>
            </p>
        </div>
    </FormField>
</template>

<style>
.form-field.slider {
    &.size-sm > .slider-outer > .slider-wrapper {
        --track-height: 3.5px;
        --knob-radius: 7px;
    }
    &.size-md > .slider-outer > .slider-wrapper {
        --track-height: 5px;
        --knob-radius: 8px;
    }
    &.size-lg > .slider-outer > .slider-wrapper {
        --track-height: 6.5px;
        --knob-radius: 9px;
    }
    &.size-xl > .slider-outer > .slider-wrapper {
        --track-height: 8px;
        --knob-radius: 10px;
    }
}
.slider-outer {
    font-size: var(--g-font-size);
    line-height: var(--line-height-text);
    display: flex;
    column-gap: var(--g-gap-lg);
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
        border-radius: var(--g-radius);

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
                box-shadow: 0 0 0 calc(1em * 10/14 * 0.6) rgb(var(--rgb-theme) / 0.15);
            }
            &:not(:disabled):active + .slider-track > .slider-progress > .slider-knob {
                box-shadow: 0 0 0 calc(1em * 10/14) rgb(var(--rgb-theme) / 0.15);
            }
            &:disabled {
                cursor: not-allowed;
                & + .slider-track {
                    background-color: var(--c-disabled-1);
                    & > .slider-progress {
                        background-color: var(--c-disabled-border);
                        & > .slider-knob {
                            background-color: var(--c-disabled-text);
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

            & > .slider-progress {
                position: absolute;
                left: 0;
                display: flex;
                align-items: center;
                height: 100%;
                border-radius: inherit;
                width: calc(var(--knob-radius) + var(--fixed-progress) + v-bind(sliderProgress) * (100% - var(--knob-diameter) - var(--fixed-progress)));
                background-color: var(--c-theme-1);
                & > .slider-knob {
                    position: absolute;
                    left: 100%;
                    transform: translateX(-50%);
                    height: var(--knob-diameter);
                    aspect-ratio: 1 / 1;
                    border-radius: var(--g-radius);
                    background-color: var(--c-theme-icon-2);
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