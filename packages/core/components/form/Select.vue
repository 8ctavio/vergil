<script setup>
import Badge from '../Badge.vue'
import Icon from '../Icon.vue'
import Btn from '../buttons/Btn.vue'
import FormField from '../private/FormField.vue'
import MiniMarkup from "../private/MiniMarkup.vue"
import { ref, computed, watchEffect, useTemplateRef, onUnmounted, nextTick, h } from 'vue'
import { useFloating, offset, flip, autoUpdate } from '@floating-ui/vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { waitFor } from '../../composables/waitFor'
import { watchControlled } from '../../composables/watchControlled'
import { isModel, deburr } from '../../utilities'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities/private'

defineOptions({ inheritAttrs: false })
const props = defineProps({
    // ----- Model -----
    value: {
        type: [String, Array],
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
    placeholderFallback: {
        type: Function,
        default: n => vergil.config.select.placeholderFallback(n)
    },
    chips: Boolean,

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
const floatLabelEnabled = computed(() => {
    return props.floatLabel
        && Boolean(props.label)
        && !(props.placeholder || props.description)
})

//-------------------- HANDLE POPOVER --------------------
const focusWithin = ref(false)
const clickWithin = ref(false)
const showFloating = ref(false)
const reference = useTemplateRef('reference')
const floating = useTemplateRef('floating')
const {
    floatingStyles,
    update: updatePosition,
    isPositioned,
} = useFloating(reference, floating, {
    placement: 'bottom-start',
    middleware: [offset(4), flip()],
    open: showFloating
})

let stopAutoUpdate
function showPopover() {
    if(!showFloating.value) {
        showFloating.value = true
        updatePosition()
        stopAutoUpdate = autoUpdate(reference.value.$el, floating.value, updatePosition, {
            elementResize: props.chips
        })
        document.addEventListener('click', handleDocumentClick)
        document.addEventListener('focusin', handleDocumentFocusIn)
        return true
    }
    return false
}
function closePopover() {
    stopAutoUpdate?.()
    stopAutoUpdate = undefined
    showFloating.value = false
    document.removeEventListener('click', handleDocumentClick)
    document.removeEventListener('focusin', handleDocumentFocusIn)
    if(focusWithin.value) {
        reference.value?.$el.focus({ preventScroll: true })
    }
}
function togglePopover() {
    if(!showPopover()) closePopover()
}
onUnmounted(() => {
    if(showFloating.value) {
        closePopover()
    }
})

function handleDocumentClick() {
    if(!clickWithin.value) {
        closePopover()
    }
    clickWithin.value = false
}
function handleDocumentFocusIn() {
    if(!focusWithin.value) {
        closePopover()
    }
}
function handleClick(event) {
    clickWithin.value = true
    if('value' in event.target.dataset) {
        updateOptions(event.target.dataset.value, {
            userInteraction: true,
            multiSelect: true
        })
    } else togglePopover()
}
watchEffect(() => {
    if(props.disabled) closePopover()
})

//-------------------- KEYBOARD NAVIGATION --------------------
const search = {
    query: '',
    queryFound: false,
    timeout: undefined
}
async function handleSelectKeydown(event) {
    if(event.key === 'Escape' && !(event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)) {
        event.stopPropagation()
        closePopover()
    } else if(event.key.length === 1 && event.key !== ' ' && !(event.altKey || event.ctrlKey || event.metaKey)) {
        //---------- SEARCH OPTIONS ----------
        if(showPopover()) {
            await waitFor(isPositioned).toBe(true)
        }
        /** 
         * @TODO If functions declared inside a setup function
         *  are optimized to have one function object across
         *  all component instances, move these functions
         *  to the setup function body.
         */
        const prune = str => deburr(str).toLocaleLowerCase()
        const key = prune(event.key)
        const options = floating.value.children[0].children
        const findNextOption = () => {
            const active = document.activeElement
            let beforeSelected = active?.tagName === 'OPTION' && key === prune(active.innerText.charAt(0))
            let foundBefore, foundAfter, foundActive = null
            for(const option of options) {
                if(beforeSelected) {
                    if(option === active) {
                        foundActive = active
                        beforeSelected = false
                    } else if(!foundBefore && key === prune(option.innerText.charAt(0))) {
                        foundBefore = option
                    }
                } else if(key === prune(option.innerText.charAt(0))) {
                    foundAfter = option
                    break
                }
            }
            return foundAfter ?? foundBefore ?? foundActive
        }
        const startTimeout = () => {
            search.timeout = setTimeout(() => {
                search.query = ''
                search.queryFound = false
                search.timeout = undefined
            }, 500)
        }

        if(search.timeout) {
            clearTimeout(search.timeout)
            if(search.queryFound) {
                search.query += key
                search.queryFound = false
                for(const option of options) {
                    if(prune(option.innerText).startsWith(search.query)) {
                        search.queryFound = true
                        option.focus()
                        break
                    }
                }
            } if(!search.queryFound) {
                findNextOption()?.focus()
            }
            startTimeout()
        } else {
            const next = findNextOption()
            if(next !== null) {
                search.query += key
                search.queryFound = true
                next.focus()
                startTimeout()
            }
        }
    }
}
function handleButtonKeydown(event) {
    if(['ArrowDown','ArrowUp'].includes(event.key)) {
        event.preventDefault()
        showPopover()
        waitFor(isPositioned).toBe(true).then(() => {
            floating.value.children[0].firstElementChild?.focus({ preventScroll: true })
        })
    } else if(event.key === 'Tab' && !(event.altKey || event.ctrlKey || event.metaKey)) {
        if(showFloating.value) {
            event.preventDefault()
            closePopover()
        }
    }
}
function handleOptionsKeydown(event) {
    if(event.target.tagName !== 'OPTION' || props.disabled) return
    const { key } = event
    if(key === 'ArrowDown') {
        event.preventDefault()
        event.target.nextElementSibling?.focus({ preventDefault: true })
    } else if(key === 'ArrowUp') {
        event.preventDefault()
        event.target.previousElementSibling?.focus({ preventDefault: true })
    } else if(['Enter',' '].includes(key)) {
        event.preventDefault()
        handleSelection(event)
    } else if(key === 'Tab' && !(event.altKey || event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        closePopover()
    }
}

//-------------------- HANDLE SELECTION --------------------
const model = useModel(props.modelValue)
const selected = ref()

const watchController = watchControlled(model.ref, (modelValue) => {
    if(Array.isArray(modelValue)) {
        if(selected.value === null || selected.value?.tagName === 'OPTION') {
            selected.value = {}
        }
        updateOptions(new Set(modelValue))
    } else {
        if(selected.value !== null && selected.value?.tagName !== 'OPTION') {
            selected.value = null
        }
        updateOptions(modelValue)
    }
}, { deep: true })
function handleSelection(event) {
    if(event.target.tagName !== 'OPTION' || props.disabled) return
    const option = event.target
    if(Array.isArray(model.value)) {
        updateMultipleSelection(option, true)
        composePlaceholder()
    } else {
        updateSingleSelection(option, true)
    }
}

const virtualPlaceholder = useTemplateRef('virtual-placeholder')
const computedPlaceholder = ref(floatLabelEnabled.value ? '' : props.placeholder)
function updateSingleSelection(option, userInteraction = false) {
    watchController.pause()
    if(userInteraction ? option.classList.contains('selected') : !option) {
        if(userInteraction) {
            model.value = ''
            option.classList.remove('selected')
        } else if(selected.value) {
            selected.value.classList.remove('selected')
        }
        selected.value = null
        computedPlaceholder.value = floatLabelEnabled.value ? '' : props.placeholder
    } else {
        if(selected.value) selected.value.classList.remove('selected')
        if(userInteraction) {
            model.value = option.value
            closePopover()
        }
        option.classList.add('selected')
        selected.value = option
        const updatePlaceholder = () => computedPlaceholder.value = option.innerText
        if(floatLabelEnabled.value && !computedPlaceholder.value) setTimeout(updatePlaceholder, 75)
        else updatePlaceholder()
    }
    watchController.resume()
}
function updateMultipleSelection(option, userInteraction = false) {
    watchController.pause()
    if(option.classList.contains('selected')) {
        if(userInteraction) {
            const idx = model.value.indexOf(option.value)
            if(idx > -1) model.value.splice(idx, 1)
        }
        option.classList.remove('selected')
        delete selected.value[option.value]
    } else {
        if(userInteraction) {
            model.value.push(option.value)
        }
        option.classList.add('selected')
        selected.value[option.value] = option.innerText
    }
    watchController.resume()
}
function composePlaceholder() {
    if(!props.chips) {
        let placeholder = ''
        for(const opt in selected.value) placeholder += `${selected.value[opt]}, `
        placeholder = placeholder.slice(0,-2)
        if(placeholder) {
            virtualPlaceholder.value.innerText = placeholder
            const n = model.value.length
            const updatePlaceholder = () => {
                computedPlaceholder.value = virtualPlaceholder.value.offsetWidth < virtualPlaceholder.value.scrollWidth
                    ? props.placeholderFallback(n)
                    : placeholder
                virtualPlaceholder.value.innerText = ''
            }
            if(floatLabelEnabled.value && !computedPlaceholder.value) setTimeout(updatePlaceholder, 75)
            else updatePlaceholder()
        } else {
            computedPlaceholder.value = floatLabelEnabled.value ? '' : props.placeholder
        }
    }
}
function updateOptions(query, { userInteraction, multiSelect } = {}) {
    const [filter, update] = (query instanceof Set) ? [
        optionValue => query.delete(optionValue) !== (optionValue in selected.value),
        walker => {
            if(walker.nextNode()) {
                do updateMultipleSelection(walker.currentNode, userInteraction)
                while(walker.nextNode())
                composePlaceholder()
            }
        }
    ] : [
        optionValue => query === optionValue,
        walker => {
            const option = walker.nextNode()
            if(multiSelect) {
                if(option) {
                    updateMultipleSelection(option, userInteraction)
                    composePlaceholder()
                }
            } else {
                updateSingleSelection(option, userInteraction)
            }
        }
    ]
    const walker = document.createTreeWalker(floating.value.children[0], NodeFilter.SHOW_ELEMENT, element => {
        return element.tagName === 'OPTION' && filter(element.value)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT
    })
    update(walker)
}

//-------------------- RENDER OPTIONS --------------------
function Options({ options }) {
    nextTick(() => {
        // After options are mounted...
        // Note: Effect dependencies are only tracked during synchronous execution
        //       (i.e., reading model.value is safe here).
        if(Array.isArray(model.value)) {
            selected.value = {}
            updateOptions(new Set(model.value))
        } else {
            updateOptions(model.value)
        }
    })
    if(options === null) return
    function decodeOption(option, decoder) {
        return (typeof decoder === 'function') ? decoder(option) : option[decoder]
    }
    if(Array.isArray(options)) {
        return options.map(option => {
            const value = decodeOption(option, props.optionValue)
            const label = decodeOption(option, props.optionLabel)
            return h('option', {
                key: value,
                value,
                tabindex: '0',
            }, label)
        })
    } else {
        return Object.entries(options).map(([key, option]) => {
            const label = decodeOption(option, props.optionLabel)
            return h('option', {
                key,
                value: key,
                tabindex: '0',
            }, label)
        })
    }
}
</script>

<template>
    <FormField :class="['select', props.class]"
        :label :hint :description :help :float-label="floatLabelEnabled"
        :size :radius :spacing
        @keydown="handleSelectKeydown"
        @focusin="focusWithin = true"
        @focusout="focusWithin = false"
        >
        <Btn ref="reference"
            :class="[
                'select-button',
                { selected: model.value.length ?? model.value }
            ]"
            v-bind="$attrs"
            ghost="translucent" outline="subtle"
            :underline :fill
            :theme :size :radius :spacing :squared="false"
            icon-right="keyboard_arrow_down"
            :disabled
            @click="handleClick"
            @keydown="handleButtonKeydown">
            <div v-if="chips && Array.isArray(model.value) && model.value.length" class="chips">
                <Badge v-for="(label,value) in selected" :key="value"
                    variant="subtle"
                    outline="subtle"
                    :theme :size :radius :spacing :squared="false"
                    >
                    {{ label }}
                    <button :data-value="value">
                        <Icon code="cancel"/>
                    </button>
                </Badge>
            </div>
            <p v-else class="select-placeholder">
                <span ref="virtual-placeholder"/>
                {{ computedPlaceholder }}
            </p>
            <template #aside>
                <label v-if="floatLabelEnabled">
                    <MiniMarkup :str="label"/>
                </label>
            </template>
        </Btn>
        <template #aside>
            <div ref="floating" class="floating" :style="floatingStyles">
                <Transition v-show="showFloating">
                    <div :class="['select-options', inferTheme(theme)]"
                        @click.stop="handleSelection"
                        @keydown="handleOptionsKeydown"
                        >
                        <Options :options/>
                    </div>
                </Transition>
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

        &:hover > .btn-content > .chips > .badge {
            box-shadow: none;
        }
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
            grid-template-columns: 1fr auto;
            align-items: center;
            & > .select-placeholder {
                position: relative;
                text-align: left;
                overflow-x: hidden;
                text-wrap: nowrap;
                text-overflow: ellipsis;
                &::selection {
                    background-color: transparent;
                }
                & > span {
                    position: absolute;
                    inset: 0;
                    visibility: hidden;
                }
            }
            & > .chips {
                font-size: calc(0.9 * var(--g-font-size));
                line-height: calc(var(--line-height-text) / 0.9);
                display: flex;
                flex-wrap: wrap;
                gap: var(--g-gap-xs) var(--g-gap-sm);
                & > .badge {
                    font-size: calc(0.9 * var(--g-font-size));
                    line-height: calc(var(--line-height-text) / 0.9);
                    column-gap: var(--g-gap-xs);
                    padding: 0 var(--g-gap-sm);
                    cursor: pointer;
                    &::selection {
                        background-color: transparent;
                    }
                    & > button {
                        font-size: calc(1em * var(--font-size-scale-icon));
                        line-height: calc(var(--line-height-icon) / 0.9);
                        aspect-ratio: 1 / 1;
                        display: flex;
                        justify-content: center;
                        opacity: 0.75;
                        transition: opacity 150ms;
                        &:hover {
                            opacity: 1;
                        }
                        & > .icon {
                            font-size: inherit;
                            line-height: inherit;
                            pointer-events: none;
                        }
                    }
                }
            }
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
    & > .floating {
        width: 100%;
        z-index: var(--z-index-popover);

        & >.select-options {
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
            backface-visibility: hidden;

            &.v-enter-active {
                transition: opacity 75ms var(--bezier-sine-out), transform 100ms var(--bezier-sine-out);
            }
            &.v-leave-active {
                transition: opacity 100ms var(--bezier-sine-in), transform 100ms var(--bezier-sine-in);
            }
            &:is(.v-enter-from, .v-leave-to){
                opacity: 0;
                transform: translateY(4px);
                /* transform: scale(0.95); */
            }
            & > option {
                flex-shrink: 0;
                padding: var(--g-gap-sm) var(--g-gap-lg);
                border-radius: inherit;
                transition: background-color 150ms;

                &:is(:hover, :focus-visible) {
                    background-color: var(--c-grey-soft-2);
                }
                &:focus-visible {
                    outline: 2px solid var(--c-theme-outline);
                }
                &::selection {
                    background-color: transparent;
                }
                &.selected {
                    background-color: var(--c-theme-soft-3);
                }
            }
        }
    }
}
</style>