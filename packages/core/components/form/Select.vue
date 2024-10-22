<script setup>
import CheckboxGroup from './CheckboxGroup.vue'
import InputText from './InputText.vue'
import Btn from '../buttons/Btn.vue'
import Badge from '../Badge.vue'
import Icon from '../Icon.vue'
import FormField from '../private/FormField.vue'
import MiniMarkup from "../private/MiniMarkup.vue"
import { ref, computed, watch, watchEffect, useTemplateRef, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useFloating, offset, flip, autoUpdate } from '@floating-ui/vue'
import { vergil } from '../../vergil'
import { useModel } from '../../composables/useModel'
import { waitFor } from '../../composables/waitFor'
import { isModel, deburr, prune } from '../../utilities'
import { isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../../utilities/private'

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
    options : [Array, Object],
    optionValue: [String, Function],
    optionLabel: [String, Function],
    optionDescription: [String, Function],
    placeholder: String,
    placeholderFallback: {
        type: Function,
        default: n => vergil.config.select.placeholderFallback(n)
    },
    filter: Boolean,
    filterInput: Object,
    placeholderNotFound: {
        type: Function,
        default: query => vergil.config.select.placeholderNotFound(query)
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

const model = useModel(props.modelValue)
const floatLabelEnabled = computed(() => {
    return props.floatLabel
        && Boolean(props.label)
        && !(props.placeholder || props.description)
})

const filterModel = useModel('')
const filterInstance = useTemplateRef('filter')

//-------------------- HANDLE POPOVER --------------------
const focusWithin = ref(false)
const clickWithin = ref(false)
const showFloating = ref(false)
const isClosed = ref(false)
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

function showPopover() {
    if(!showFloating.value) {
        showFloating.value = true
        isClosed.value = false
        updatePosition()
        stopAutoUpdate = autoUpdate(reference.value.$el, floating.value, updatePosition, {
            elementResize: props.filter || props.chips
        })
        document.addEventListener('click', handleDocumentClick)
        document.addEventListener('focusin', handleDocumentFocusIn)
        if(props.filter) {
            nextTick(() => {
                filterInstance.value.focus()
            })
        }
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
    if(props.filter) {
        waitFor(isClosed).toBe(true).then(() => {
            filterModel.value = ''
            handleFilterInput()
        })
    }
}
function togglePopover() {
    if(!showPopover()) closePopover()
}

onMounted(() => {
    watchEffect(() => {
        if(props.disabled) {
            closePopover()
        }
    })
})
onBeforeUnmount(() => {
    if(showFloating.value) {
        closePopover()
    }
})

//-------------------- KEYBOARD NAVIGATION --------------------
const search = {
    query: '',
    queryFound: false,
    timeout: undefined
}
function focusAdjacentOption(el, prev = false) {
    while(el?.hidden) {
        el = el[`${prev ? 'previous':'next'}ElementSibling`]
    }
    el?.firstElementChild.focus()
}
async function handleSelectKeydown(event) {
    if(event.key === 'Escape' && !(event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)) {
        event.stopPropagation()
        closePopover()
    } else if(event.key.length === 1 && event.key !== ' ' && !(event.altKey || event.ctrlKey || event.metaKey)) {
        if(showPopover()) {
            await waitFor(isPositioned).toBe(true)
        }
        if(props.filter) {
            if(event.target.tagName !== 'INPUT' || event.target.type !== 'text') {
                filterInstance.value.focus()
            }
        } else {
            const prune = str => deburr(str).toLowerCase()
            const key = prune(event.key)
            const options = model.el.children
            const findNextOption = () => {
                const active = document.activeElement
                let beforeSelected = active?.tagName === 'INPUT'
                    && active.type === 'checkbox'
                    && key === prune(active.parentElement.querySelector('& > .toggle-label').innerText.charAt(0))
                let foundBefore, foundAfter, foundActive = null
                for(const option of options) {
                    if(beforeSelected) {
                        if(option.firstElementChild === active) {
                            foundActive = active
                            beforeSelected = false
                        } else if(!foundBefore && key === prune(option.querySelector('& > .toggle-label').innerText.charAt(0))) {
                            foundBefore = option.firstElementChild
                        }
                    } else if(key === prune(option.querySelector('& > .toggle-label').innerText.charAt(0))) {
                        foundAfter = option.firstElementChild
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
                        if(prune(option.querySelector('& > .toggle-label').innerText).startsWith(search.query)) {
                            search.queryFound = true
                            option.firstElementChild.focus()
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
    } else if(event.target.tagName !== 'INPUT' || event.target.type !== 'checkbox') {
        if(['ArrowDown','ArrowUp'].includes(event.key)) {
            event.preventDefault()
            if(showPopover()) {
                await waitFor(isPositioned).toBe(true)
            }
            focusAdjacentOption(model.el.firstElementChild)
        } else if(event.key === 'Tab' && !(event.altKey || event.ctrlKey || event.metaKey)) {
            if(showFloating.value && !props.filter) {
                event.preventDefault()
                closePopover()
            } else if(event.target.tagName === 'INPUT' && event.target.type === 'text' && !event.shiftKey) {
                event.preventDefault()
                reference.value?.$el.focus({ preventScroll: true })
            }
        }
    }
}
function handleOptionsKeydown(event) {
    const { key } = event
    if(key === 'ArrowDown') {
        event.preventDefault()
        focusAdjacentOption(event.target.parentElement?.nextElementSibling)
    } else if(key === 'ArrowUp') {
        event.preventDefault()
        focusAdjacentOption(event.target.parentElement?.previousElementSibling, true)
    } else if(key === 'Enter') {
        if(Array.isArray(model.value)) {
            const idx = model.value.indexOf(event.target.value)
            if(idx > -1) {
                model.value.splice(idx,1)
            } else {
                model.value.push(event.target.value)
            }
        } else {
            model.value = event.target.value
        }
    } else if(key === 'Tab' && !(event.altKey || event.ctrlKey || event.metaKey)) {
        if(event.shiftKey && props.filter) {
            event.preventDefault()
            filterInstance.value.focus()
        } else {
            event.preventDefault()
            closePopover()
        }
    }
}

//-------------------- SELECT BUTTON --------------------
function handleBtnClick(event) {
    clickWithin.value = true
    if('value' in event.target.dataset && Array.isArray(model.value)) {
        const idx = model.value.indexOf(event.target.dataset.value)
        if(idx > -1) model.value.splice(idx,1)
    } else togglePopover()
}

//-------------------- FILTER OPTIONS --------------------
const empty = ref(false)
function handleFilterInput(event) {
    const options = model.el.children
    const query = prune(event?.target.value ?? '')
    empty.value = true
    for(const option of options) {
        if(prune(option.querySelector('& > .toggle-label').innerText).includes(query)) {
            option.hidden = false
            if(empty.value) empty.value = false
        } else {
            option.hidden = true
        }
    }
}

//-------------------- HANDLE SELECTION --------------------
function handleOptionsChange(event) {
    updatePlaceholder(event.target, true)
}
watch(model.ref, (newModelValue, oldModelValue) => {
    if(Array.isArray(newModelValue)) {
        if(!Array.isArray(oldModelValue)) {
            selected.value = {}
        }
        updateOptions(new Set(newModelValue))
    } else {
        updateOptions(newModelValue)
    }
}, { deep: 1, flush: 'post' })

const selected = ref({})
const virtualPlaceholder = useTemplateRef('virtual-placeholder')
const computedPlaceholder = ref(floatLabelEnabled.value ? '' : props.placeholder)
function updatePlaceholder(input, userInteraction = false) {
    if(Array.isArray(model.value)) {
        updateSelected(input)
        composePlaceholder()
    } else {
        if(input?.checked) {
            const update = () => {
                computedPlaceholder.value = input.parentElement.querySelector('& > .toggle-label').innerText
            }
            if(floatLabelEnabled.value && !computedPlaceholder.value) setTimeout(update, 75)
            else update()
            if(userInteraction) closePopover()
        } else {
            computedPlaceholder.value = floatLabelEnabled.value ? '' : props.placeholder
        }
    }
}
function updateSelected(input) {
    if(input.checked) {
        selected.value[input.value] = input.parentElement.querySelector('& > .toggle-label').innerText
    } else {
        delete selected.value[input.value]
    }
}
function composePlaceholder() {
    if(!props.chips) {
        let placeholder = ''
        for(const opt in selected.value) placeholder += `${selected.value[opt]}, `
        placeholder = placeholder.slice(0,-2)
        if(placeholder) {
            virtualPlaceholder.value.innerText = placeholder
            const n = model.value.length
            const update = () => {
                computedPlaceholder.value = virtualPlaceholder.value.offsetWidth < virtualPlaceholder.value.scrollWidth
                    ? props.placeholderFallback(n)
                    : placeholder
                virtualPlaceholder.value.innerText = ''
            }
            if(floatLabelEnabled.value && !computedPlaceholder.value) setTimeout(update, 75)
            else update()
        } else {
            computedPlaceholder.value = floatLabelEnabled.value ? '' : props.placeholder
        }
    }
}
function updateOptions(query) {
    const [filter, update] = (query instanceof Set) ? [
        optionValue => query.delete(optionValue) !== (optionValue in selected.value),
        walker => {
            if(walker.nextNode()) {
                do updateSelected(walker.currentNode.firstElementChild)
                while(walker.nextNode())
                composePlaceholder()
            }
        }
    ] : [
        optionValue => query === optionValue,
        walker => {
            updatePlaceholder(walker.nextNode()?.firstElementChild)
        }
    ]
    const walker = document.createTreeWalker(model.el, NodeFilter.SHOW_ELEMENT, element => {
        return element.tagName === 'LABEL' && filter(element.firstElementChild.value)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT
    })
    update(walker)
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
            @click="handleBtnClick">
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
            <div ref="floating"
                class="floating"
                :style="floatingStyles"
                @click="clickWithin = true"
                >
                <Transition v-show="showFloating" @after-leave="isClosed = true">
                    <div class="select-dropdown">
                        <InputText v-if="filter" 
                            ref="filter"
                            v-bind="filterInput"
                            v-model="filterModel"
                            :placeholder="filterInput?.placeholder ?? vergil.config.select.placeholderFilter"
                            :icon="filterInput?.icon ?? 'search'"
                            @input="handleFilterInput"
                        />
                        <p v-if="empty" class="select-not-found">
                            <MiniMarkup :str="placeholderNotFound(filterModel.value)"/>
                        </p>
                        <CheckboxGroup v-show="!empty"
                            ref="select-options"
                            :modelValue="model"
                            :options
                            :optionValue
                            :optionLabel
                            :optionDescription
                            :disabled
                            :theme :spacing
                            variant="list"
                            @change="handleOptionsChange"
                            @keydown="handleOptionsKeydown"
                        />
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

        & > .select-dropdown {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: var(--g-gap-xs);
            width: 100%;
            border-radius: var(--g-radius);
            border: 1px solid var(--c-grey-border-subtle);
            background-color: var(--c-bg);
            box-shadow: 2px 2px 3px var(--c-box-shadow);

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

            & > .input-text {
                margin: var(--g-gap-md) var(--g-gap-sm);
                margin-bottom: 0;
                & > .input-text-outer > .input-text-wrapper {
                    padding: var(--g-gap-sm) var(--g-gap-md);
                    & > input {
                        padding: 0;
                    }
                }
            }
            & > .select-not-found {
                padding: var(--g-gap-md) var(--g-gap-lg);
                text-align: center;
                line-height: 1.5;
                color: var(--c-grey-text-2);
                & > .inline-block {
                    max-width: 100%;
                    overflow-x: hidden;
                    text-wrap: nowrap;
                    text-overflow: ellipsis;
                }
            }
            & > .checkbox-group > .toggle-group-wrapper {
                --select-max-options: 7;
                height: max-content;
                max-height: calc(
                    ((var(--select-max-options) - 1) * var(--g-gap-xs))
                    + ((var(--select-max-options) + 1) * var(--g-gap-sm) * 2)
                    + (var(--select-max-options) * var(--line-height-text) * 1em)
                );
                overflow-y: auto;
                cursor: pointer;

                & > .checkbox {
                    padding: var(--g-gap-sm) var(--g-gap-lg);
                    &[hidden] {
                        display: none;
                    }
                    & > p::selection{
                        background-color: transparent;
                    }
                }
            }
        }
    }
}
</style>