<script setup>
import Btn from '../buttons/Btn.vue'
import FormField from '../private/FormField.vue'
import MiniMarkup from "../private/MiniMarkup.vue"
import { ref, computed, useTemplateRef, h } from 'vue'
import { useFloating, offset, flip, autoUpdate } from '@floating-ui/vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { isModel } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities/private'

defineEmits(['update:modelValue'])
defineOptions({ inheritAttrs: false })
const {
    modelValue,
    options, optionValue, optionLabel,
    label, placeholder, description, floatLabel,
    class: classProp
} = defineProps({
    // ----- Model -----
    value: {
        type: String,
        default: ''
    },
    modelValue: {
        default: props => useModel(props.value),
        validator: isModel
    },

    //----- Component specific -----
    options : {
        type: [Array, Object],
        default: () => ([])
    },
    optionValue: {
        type: [String, Function],
        default: () => (v => v)
    },
    optionLabel: {
        type: [String, Function],
        default: () => (v => v)
    },
    placeholder: String,

    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,
    floatLabel: Boolean,

    //----- Appearance -----
    underline: {
        type: Boolean,
        default: props => vergil.config.select[props.variant]?.underline,
    },
    fill: {
        type: Boolean,
        default: props => vergil.config.select[props.variant]?.fill,
    },
    theme: {
        type: String,
        default: () => vergil.config.select.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.select.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.select.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: () => vergil.config.select.spacing ?? vergil.config.global.spacing,
        validator: isValidSpacing
    },
    disabled: Boolean,
    class: [String, Object],
})
const floatLabelEnabled = computed(() => floatLabel && Boolean(label) && !(placeholder || description))

//-------------------- POPOVER --------------------
const reference = useTemplateRef('reference')
const floating = useTemplateRef('floating')
const { floatingStyles, update: updatePosition } = useFloating(reference, floating, {
    placement: 'bottom-start',
    middleware: [offset(4), flip()],
})

let stopAutoUpdate
const showFloating = ref(false)
function togglePopover(event) {
    if(!showFloating.value) {
        showFloating.value = true
        updatePosition()
        stopAutoUpdate = autoUpdate(reference.value.$el, floating.value, updatePosition, {
            elementResize: false
        })
    } else {
        stopAutoUpdate?.()
        showFloating.value = false
    }
}

//-------------------- OPTIONS --------------------
function Options(props) {
    const { options } = props
    if(options === null) return
    if(Array.isArray(options)) {
        return options.map(option => {
            const value = typeof optionValue === 'function' ? optionValue(option) : option[optionValue]
            const label = typeof optionLabel === 'function' ? optionLabel(option) : option[optionLabel]
            return h('option', {
                key: value,
                value,
                tabindex: '0'
            }, label)
        })
    } else {
        return Object.entries(options).map(([key, option] )=> {
            const label = typeof optionLabel === 'function' ? optionLabel(option) : option[optionLabel]
            return h('option', {
                key,
                value: key,
                tabindex: '0'
            }, label)
        })
    }
}

//-------------------- SELECTION --------------------
const model = useModel(modelValue)

let prevOption = null
const computedPlaceholder = ref(floatLabelEnabled.value ? '' : placeholder)
function handleSelection(event) {
    if(event.target.tagName !== 'OPTION') return
    const option = event.target
    if(Array.isArray(model.value)) {

    } else {
        if(option.classList.contains('selected')) {
            computedPlaceholder.value = floatLabelEnabled.value ? '' : placeholder
            option.classList.remove('selected')
            model.value = ''
        } else {
            const updatePlaceholder = () => computedPlaceholder.value = option.innerText
            if(floatLabelEnabled.value && !model.value) setTimeout(updatePlaceholder, 75)
            else updatePlaceholder()
            if(prevOption) prevOption.classList.remove('selected')
            option.classList.add('selected')
            model.value = option.value
            showFloating.value = false
            prevOption = option
        }
    }
}
</script>

<template>
    <FormField :class="['select', classProp]"
        :label :hint :description :help :float-label="floatLabelEnabled"
        :size :radius :spacing
        >
        <Btn ref="reference"
            :class="[
                'select-button',
                { selected: model.value }
            ]"
            v-bind="$attrs"
            ghost="translucent" outline="subtle"
            :underline :fill
            :theme :size :radius :spacing :squared="false"
            icon-right="keyboard_arrow_down"
            :disabled
            @click="togglePopover">
            <template v-if="computedPlaceholder">
                {{ computedPlaceholder }}
            </template>
            <template v-else>
                &ZeroWidthSpace;
            </template>
            <template #aside>
                <label v-if="floatLabelEnabled">
                    <MiniMarkup :str="label"/>
                </label>
            </template>
        </Btn>
        <template #aside>
            <div v-show="showFloating" ref="floating"
                :style="floatingStyles"
                :class="[
                    'select-options',
                    inferTheme(theme)
                ]"
                @click.stop="handleSelection">
                <Options :options/>
            </div>
        </template>
    </FormField>
</template>

<style>
.select {
    position: relative;
    width: 200px;
    /* overflow: hidden; */

    & > .select-button.btn {
        font-weight: 400;
        overflow: visible;

        &:disabled {
            --btn-c-border: var(--c-disabled-border-1);
            background-color: var(--c-disabled-1);
        }
        &.ghost-translucent {
            --btn-c-1: var(--c-bg);
        }
        &.selected {
            --btn-c-text-1: var(--c-text);
            & > label {
                font-size: 0.9em;
                font-weight: 450;
                padding: 0;
                color: var(--c-text);
                transform: translateY(-100%);
                padding-bottom: var(--g-gap-sm);
                transition: transform 150ms, padding 150ms 50ms, font-size 150ms;
            }
        }
        & > .btn-content {
            justify-content: space-between;
        }
        & > label {
            position: absolute;
            top: 0;
            left: 0;
            padding: var(--g-gap-md) var(--g-gap-lg);
            pointer-events: none;
            user-select: none;
            transform: translateY(0);
            transition: transform 150ms 50ms, padding 150ms, font-size 150ms 50ms;
        }
    }
    & > .select-options {
        --select-max-options: 7;
        display: flex;
        flex-direction: column;
        gap: var(--g-gap-xs);
        padding: var(--g-gap-sm);
        box-sizing: border-box;
        width: 100%;
        height: max-content;
        max-height: calc(
            1.6px
            + ((var(--select-max-options) - 1) * var(--g-gap-xs))
            + ((var(--select-max-options) + 1) * var(--g-gap-sm) * 2)
            + (var(--select-max-options) * var(--line-height-text) * 1em)
        );
        overflow-y: auto;
        border-radius: var(--g-radius);
        border: 1px solid var(--c-grey-border-subtle);
        background-color: var(--c-bg);
        color: var(--c-text);
        box-shadow: 2px 2px 3px var(--c-box-shadow);
        cursor: pointer;
        z-index: var(--z-index-popover);

        
        & > option {
            flex-shrink: 0;
            padding: var(--g-gap-sm) var(--g-gap-lg);
            border-radius: inherit;
            transition: background-color 150ms;

            &:hover {
                background-color: var(--c-grey-soft-2);
            }
            &.selected {
                background-color: var(--c-theme-soft-3);
            }
            &::selection {
                background-color: transparent;
            }
        }
    }
}
</style>