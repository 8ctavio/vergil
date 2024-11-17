<script setup>
import CheckboxGroup from './CheckboxGroup.vue'
import InputText from './InputText.vue'
import Btn from '../buttons/Btn.vue'
import Badge from '../Badge.vue'
import Icon from '../Icon.vue'
import FormField from '../private/FormField.vue'
import MiniMarkup from "../private/MiniMarkup"
import { ref, computed, watch, watchEffect, useTemplateRef, onMounted } from 'vue'
import { vergil } from '../../vergil'
import { useModel, usePopover, isModel } from '../../composables'
import { prune } from '../../utilities'
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
    options : Object,
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
const isMultiSelect = computed(() => Array.isArray(model.value))
const isSelected = computed(() => Boolean(Array.isArray(model.value) ? model.value.length : model.value))
const selected = ref(null)

const floatLabelEnabled = computed(() => {
    return props.floatLabel
        && Boolean(props.label)
        && !(props.placeholder || props.description)
})

const filterModel = useModel('')

//-------------------- POPOVER --------------------
const {
    Popover,
    openPopover,
    closePopover,
    togglePopover,
    isOpen,
} = usePopover({
    placement: 'bottom-start',
    offset: 4,
    closeBehavior: 'hide',
    resize: () => props.filter || props.chips,
})
watch(isOpen, () => {
    if(props.filter) {
        if(isOpen.value) {
            filterModel.el.focus()
            filterModel.el.select()
        } else {
            filterModel.value = ''
            handleFilterInput()
        }
    }
}, { flush: 'sync' })
onMounted(() => {
    watchEffect(() => {
        if(props.disabled) {
            closePopover()
        }
    })
})

//-------------------- SELECT BUTTON --------------------
function handleBtnClick(event) {
    if('value' in event.target.dataset && isMultiSelect.value) {
        const idx = model.value.indexOf(event.target.dataset.value)
        if(idx > -1) model.value.splice(idx,1)
    } else togglePopover()
}

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
    } else if(['ArrowDown','ArrowUp'].includes(event.key)) {
        event.preventDefault()
        if(await openPopover(true)) {
            let relative = 'nextElementSibling'
            let option = model.el.firstElementChild
            if(event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
                if(event.key === 'ArrowUp')
                    relative = 'previousElementSibling'
                option = event.target.parentElement[relative]
            } else if(!isMultiSelect.value && selected.value && !selected.value.parentElement.hidden) {
                option = selected.value.parentElement
            }

            while(option?.hidden) {
                option = option[relative]
            }
            option?.firstElementChild.focus()
        }
    } else if(event.key === 'Enter') {
        if(event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
            event.preventDefault()
            if(isMultiSelect.value) {
                if(event.target.checked) {
                    const idx = model.value.indexOf(event.target.value)
                    if(idx > -1) model.value.splice(idx,1)
                } else {
                    model.value.push(event.target.value)
                }
            } else {
                if(event.target.checked) {
                    model.value = ''
                } else {
                    model.value = event.target.value
                }
            }
        }
    } else if(event.key === 'Tab' && !(event.altKey || event.ctrlKey || event.metaKey)) {
        if(event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
            if(!event.target.checked) {
                if(isMultiSelect.value) {
                    model.value.push(event.target.value)
                } else {
                    model.value = event.target.value
                }
            }
        }
    } else if (props.filter) {
        if(
            (event.target.tagName !== 'INPUT' || event.target.type !== 'text')
            && !(event.altKey || event.ctrlKey || event.metaKey)
            && (
                (event.key.length === 1 && event.key !== ' ')
                || ['Backspace','ArrowLeft','ArrowRight','Delete','Clear'].includes(event.key)
            )
            && await openPopover(true)
        ) {
            filterModel.el.selectionStart = filterModel.value.length
            filterModel.el.focus()
        }
    } else if(event.key.length === 1 && event.key !== ' ' && !(event.altKey || event.ctrlKey || event.metaKey)) {
        if(!(await openPopover(true))) return
        const key = prune(event.key)
        const options = model.el.children
        const findNextOption = () => {
            const active = document.activeElement
            let beforeSelected = active?.tagName === 'INPUT'
                && active.type === 'checkbox'
                && key === active.dataset.prunedLabel.charAt(0)
            let foundBefore, foundAfter, foundActive = null
            for(const { firstElementChild: input } of options) {
                if(beforeSelected) {
                    if(input === active) {
                        foundActive = active
                        beforeSelected = false
                    } else if(!foundBefore && key === input.dataset.prunedLabel.charAt(0)) {
                        foundBefore = input
                    }
                } else if(key === input.dataset.prunedLabel.charAt(0)) {
                    foundAfter = input
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
                for(const { firstElementChild: input } of options) {
                    if(input.dataset.prunedLabel.startsWith(search.query)) {
                        search.queryFound = true
                        input.focus()
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
watch(() => props.options, () => {
    updateOptions(model.value)
}, { flush: 'post' })
watch(model.ref, updateOptions, { deep: 1, flush: 'post' })

const virtualPlaceholder = useTemplateRef('virtual-placeholder')
const computedPlaceholder = ref(floatLabelEnabled.value ? '' : props.placeholder)
function createOptionsWalker(filter) {
    return document.createTreeWalker(model.el, NodeFilter.SHOW_ELEMENT, element => {
        return element.tagName === 'LABEL' && filter(element.firstElementChild.value)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT
    })
}
function updateOptions(modelValue) {
    if(Array.isArray(modelValue)) {
        if(typeof selected.value !== 'object' || selected.value === null) {
            selected.value = {}
        }
        const selectedSet = new Set(modelValue)
        const walker = createOptionsWalker(optionValue => {
            return selectedSet.delete(optionValue) !== (optionValue in selected.value)
        })
        if(walker.nextNode()) {
            do {
                const input = walker.currentNode.firstElementChild
                if(input.checked) {
                    selected.value[input.value] = input
                } else {
                    delete selected.value[input.value]
                }
            } while(walker.nextNode())
            if(!props.chips) {
                let placeholder = ''
                for(const opt in selected.value) placeholder += `${selected.value[opt].dataset.label}, `
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
    } else {
        const walker = createOptionsWalker(optionValue => modelValue === optionValue)
        const input = walker.nextNode()?.firstElementChild
        selected.value = input
        if(input?.checked) {
            const updatePlaceholder = () => {
                computedPlaceholder.value = input.parentElement.querySelector('& > .toggle-label').innerText
            }
            if(floatLabelEnabled.value && !computedPlaceholder.value) setTimeout(updatePlaceholder, 75)
            else updatePlaceholder()
            /**
             * @NOTE Ideally, only close if model changed due to user interaction.
             *  If model changed due to a programmatic mutation, popover should
             *  not be closed.
             * 
             *  Native Vue's v-model is not compatible with Vergil's approach of
             *  ignoring model mutations inside event handlers since the handler
             *  attached by v-model cannot be customized.
             */
            closePopover()
        } else {
            computedPlaceholder.value = floatLabelEnabled.value ? '' : props.placeholder
        }
    }
}
</script>

<template>
    <FormField :class="['select', props.class]"
        :label :hint :description :help :float-label="floatLabelEnabled"
        :size :radius :spacing
    >
        <Popover :class="['select-popover', props.class]"
            :theme :size :radius
            @keydown="handleSelectKeydown"
        >
            <Btn
                v-bind="$attrs"
                :class="[
                    'select-button',
                    { selected: isSelected }
                ]"
                ghost="translucent"
                outline="subtle"
                icon-right="keyboard_arrow_down"
                :fill
                :underline
                :disabled
                :squared="false"
                :theme :size :radius :spacing
                @click="handleBtnClick"
                @keydown="handleSelectKeydown"
            >
                <div v-if="chips && isMultiSelect && isSelected" class="chips">
                    <Badge v-for="input in selected" :key="input.value"
                        variant="subtle"
                        outline="subtle"
                        :theme :size :radius :spacing :squared="false"
                        >
                        {{ input.dataset.label }}
                        <button :data-value="input.value">
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
            <template #portal>
                <InputText v-if="filter" 
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
                    :show-symbol="isMultiSelect"
                    variant="list"
                    tabindex="-1"
                    :options-attributes="(key,value,label,description) => ({
                        tabindex: '-1',
                        'data-label': label,
                        'data-pruned-label': prune(label)
                    })"
                />
            </template>
        </Popover>
    </FormField>
</template>

<style>
.select > .select-button.btn {
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

#popover-portal > .popover-wrapper > .select-popover {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--g-gap-xs);
    width: 100%;
    border-radius: var(--g-radius);
    border: 1px solid var(--c-grey-border-subtle);
    background-color: var(--c-bg);
    box-shadow: 2px 2px 3px var(--c-box-shadow);

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
        font-size: var(--g-font-size);
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

        &:focus-visible {
            outline: none;
        }
        & > .checkbox {
            padding: var(--g-gap-sm) var(--g-gap-lg);
            &[hidden] {
                display: none;
            }
            & > p::selection {
                background-color: transparent;
            }
        }
    }
}
</style>