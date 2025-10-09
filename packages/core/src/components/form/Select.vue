<script setup lang="ts">
import { shallowRef, triggerRef, computed, useTemplateRef, watch, watchEffect, nextTick, getCurrentScope, onMounted } from 'vue'
import { vergil } from '#vergil'
import { CheckboxGroup, InputText, Btn, Badge, Icon, FormField, MiniMarkup } from '#components'
import { useModel, useDefineModel, usePopover } from '#composables'
import { prune, isObject, isInput, isTabKey, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '#utilities'
import type { PropType } from 'vue'
import type { SelectionOptions, SelectionOptionProperty } from '#components'
import type { ModelValueProp, ModelValidatorProp } from '#composables'
import type { Elements } from '#reactivity'
import type { Theme, Size, Radius, Spacing } from '#utilities'


defineOptions({ inheritAttrs: false })
const props = defineProps({
    //----- Model -----
    value: {
        type: [String, Array] as PropType<string | string[]>,
        default: ''
    },
    modelValue: {
        type: [String, Object] as ModelValueProp<string | string[]>,
        default: (props: { value: string | string[] }) => props.value
    },
    ['onUpdate:modelValue']: Function,
    validator: Function as ModelValidatorProp<string | string[]>,
    eagerValidation: Boolean,
    elements: Object as PropType<Elements>,

    options : Object as PropType<SelectionOptions>,
    optionValue: [String, Function] as PropType<SelectionOptionProperty>,
    optionLabel: [String, Function] as PropType<SelectionOptionProperty>,
    optionDescription: [String, Function] as PropType<SelectionOptionProperty>,
    placeholder: String,
    placeholderFallback: {
        type: Function as PropType<(n: number) => string>,
        default: (n: number) => vergil.config.select.placeholderFallback(n)
    },
    filter: Boolean,
    filterInput: Object as PropType<Record<string, unknown>>,
    placeholderNotFound: {
        type: Function as PropType<(query: string) => string>,
        default: (query: string) => vergil.config.select.placeholderNotFound(query)
    },
    chips: Boolean,
    underline: {
        type: Boolean,
        default: () => vergil.config.select.underline,
    },
    fill: {
        type: Boolean,
        default: () => vergil.config.select.fill,
    },
    disabled: Boolean,
    class: [String, Object],

    //----- FormField -----
    label: String,
    hint: String,
    description: String,
    help: String,
    showErrors: Boolean,
    floatLabel: Boolean,
    
    //----- Global -----
    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.select.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.select.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.select.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.select.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    },
})

const model = useDefineModel({
    isCollection: true,
    includeElements: true,
    captureElements: true
})
const isMultiSelect = computed(() => Array.isArray(model.value))
const isSelected = computed(() => Boolean(Array.isArray(model.value) ? model.value.length : model.value))
const selected = shallowRef<HTMLInputElement | Set<HTMLInputElement> | null>(null)

const floatLabelEnabled = computed(() => {
    return props.floatLabel
        && Boolean(props.label)
        && !(props.placeholder || props.description)
})

const filterModel = useModel('', { includeElements: true })

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
    if (props.filter) {
        if (isOpen.value) {
            ;(filterModel.elements.input as HTMLInputElement).focus()
            ;(filterModel.elements.input as HTMLInputElement).select()
        } else {
            filterModel.value = ''
            handleFilterInput()
        }
    }
}, { flush: 'sync' })

//-------------------- SELECT BUTTON --------------------
function handleBtnClick(event: PointerEvent) {
    if (Object.hasOwn((event.target as HTMLElement).dataset, 'value') && isMultiSelect.value) {
        updateSelection({
            value: (event.target as HTMLElement).dataset.value as string,
            checked: true
        })
    } else togglePopover()
}

//-------------------- KEYBOARD NAVIGATION --------------------
const search: {
    query: string;
    queryFound: boolean;
    timeout?: number;
} = {
    query: '',
    queryFound: false,
    timeout: undefined
}
async function handleSelectKeydown(event: KeyboardEvent) {
    if (['ArrowDown','ArrowUp'].includes(event.key)) {
        event.preventDefault()
        if (await openPopover(true)) {
            let relative: 'nextElementSibling' | 'previousElementSibling' = 'nextElementSibling'
            let option = model.elements.options!.firstElementChild as HTMLElement | null
            if (isInput(event.target as HTMLElement, 'checkbox')) {
                if (event.key === 'ArrowUp') relative = 'previousElementSibling'
                option = (event.target as HTMLElement).parentElement![relative] as HTMLElement | null
            } else if (!isMultiSelect.value && selected.value && !(selected.value as HTMLInputElement).parentElement!.hidden) {
                option = (selected.value as HTMLInputElement).parentElement
            }

            while (option?.hidden) {
                option = option[relative] as HTMLElement | null
            }
            if (option) (option.firstElementChild as HTMLElement).focus()
        }
    } else if (event.key === 'Enter') {
        if (isInput(event.target as HTMLElement, 'checkbox')) {
            event.preventDefault()
            updateSelection(event.target as HTMLInputElement, true)
        }
    } else if (isTabKey(event, false)) {
        if (isInput(event.target as HTMLElement, 'checkbox') && !(event.target as HTMLInputElement).checked) {
            updateSelection(event.target as HTMLInputElement, false)
        }
    } else if (props.filter) {
        if (
            !isInput(event.target as HTMLElement, 'text')
            && !(event.altKey || event.ctrlKey || event.metaKey)
            && (
                (event.key.length === 1 && event.key !== ' ')
                || ['Backspace','ArrowLeft','ArrowRight','Delete','Clear'].includes(event.key)
            )
            && await openPopover(true)
        ) {
            ;(filterModel.elements.input as HTMLInputElement).selectionStart = filterModel.value.length
            ;(filterModel.elements.input as HTMLInputElement).focus()
        }
    } else if(event.key.length === 1 && event.key !== ' ' && !(event.altKey || event.ctrlKey || event.metaKey)) {
        if (!(await openPopover(true))) return
        const key = prune(event.key)
        const options = model.elements.options!.children
        const findNextOption = () => {
            const active = document.activeElement
            let beforeSelected = active?.tagName === 'INPUT'
                && (active as HTMLInputElement).type === 'checkbox'
                && key === (active as HTMLElement).dataset.prunedLabel?.charAt(0)
            let foundBefore, foundAfter, foundActive = null
            for (const { firstElementChild: input } of options) {
                if (beforeSelected) {
                    if (input === active) {
                        foundActive = active as HTMLElement
                        beforeSelected = false
                    } else if (!foundBefore && key === ((input as HTMLElement).dataset.prunedLabel as string).charAt(0)) {
                        foundBefore = input as HTMLElement
                    }
                } else if (key === ((input as HTMLElement).dataset.prunedLabel as string).charAt(0)) {
                    foundAfter = input as HTMLElement
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

        if (search.timeout) {
            clearTimeout(search.timeout)
            if (search.queryFound) {
                search.query += key
                search.queryFound = false
                for (const { firstElementChild: input } of options) {
                    if (((input as HTMLElement).dataset.prunedLabel as string).startsWith(search.query)) {
                        search.queryFound = true
                        ;(input as HTMLElement).focus()
                        break
                    }
                }
            } if (!search.queryFound) {
                findNextOption()?.focus()
            }
            startTimeout()
        } else {
            const next = findNextOption()
            if (next !== null) {
                search.query += key
                search.queryFound = true
                next.focus()
                startTimeout()
            }
        }
    }
}

//-------------------- FILTER OPTIONS --------------------
const empty = shallowRef(false)
function handleFilterInput(event?: Event) {
    const options = model.elements.options!.children
    const query = event ? prune((event.target as HTMLInputElement).value) : ''
    empty.value = true
    for(const option of options) {
        if(prune((option.querySelector('& > .toggle-label') as HTMLElement).innerText).includes(query)) {
            (option as HTMLElement).hidden = false
            if(empty.value) empty.value = false
        } else {
            (option as HTMLElement).hidden = true
        }
    }
}

//-------------------- HANDLE SELECTION --------------------
watch(() => props.options, () => {
    updateOptions(true, true)
}, { flush: 'post' })
model.onExternalUpdate((v, u, isProgrammatic) => {
    updateOptions(!isProgrammatic)
}, { flush: 'post' })
function handleChange() {
    updateOptions(true)
}

const setupScope = getCurrentScope()!
onMounted(() => {
    // Await next tick since popover mount is deferred
    nextTick(updateOptions)
    setupScope.run(() => {
        watchEffect(() => {
            if(props.disabled) closePopover()
        })
    })
})

function updateSelection(option: { value: string, checked: boolean }, closeOnUpdated = false) {
    model.update(() => {
        if (isMultiSelect.value) {
            const idx = (model.value as string[]).indexOf(option.value)
            if (idx > -1) {
                if (option.checked) {
                    (model.value as string[]).splice(idx,1)
                    model.triggerIfShallow()
                    model.handleValidation(props.eagerValidation)
                }
            } else if (!option.checked) {
                (model.value as string[]).push(option.value)
                model.triggerIfShallow()
                model.handleValidation(props.eagerValidation)
            }
        } else {
            model.value = option.checked ? '' : option.value
            model.handleValidation(props.eagerValidation)
        }
    })
    nextTick(() => {
        updateOptions(closeOnUpdated)
    })
}

const virtualPlaceholder = useTemplateRef('virtual-placeholder')
const computedPlaceholder = shallowRef(floatLabelEnabled.value ? '' : props.placeholder)
function createOptionsWalker(filter: (option: HTMLInputElement) => boolean) {
    return document.createTreeWalker(model.elements.options!, NodeFilter.SHOW_ELEMENT, element => {
        return (element as HTMLElement).tagName === 'LABEL' && filter((element as HTMLElement).firstElementChild as HTMLInputElement)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT
    })
}
function updateOptions(closeOnUpdated = false, resetSelection = false) {
    if (Array.isArray(model.value)) {
        if (!isObject(selected.value) || Object.getPrototypeOf(selected.value) !== Set.prototype) {
            selected.value = new Set()
        }
        if (resetSelection) (selected.value as Set<HTMLInputElement>).clear()

        const modelValue = new Set(model.value)
        const walker = createOptionsWalker(option => {
            return modelValue.delete(option.value) !== (selected.value as Set<HTMLInputElement>).has(option)
        })
        const updateSelection = walker.nextNode() !== null
        if (updateSelection) {
            do {
                const input = (walker.currentNode as HTMLElement).firstElementChild as HTMLInputElement
                (selected.value as Set<HTMLInputElement>)[input.checked ? 'add' : 'delete'](input)
            } while(walker.nextNode())
            triggerRef(selected)
        }
        if (!props.chips && (updateSelection || resetSelection)) {
            let placeholder = ''
            ;(selected.value as Set<HTMLInputElement>).forEach(option => placeholder += `${option.dataset.label}, `)
            placeholder = placeholder.slice(0,-2)
            if (placeholder) {
                virtualPlaceholder.value!.innerText = placeholder
                const n = model.value.length
                const updatePlaceholder = () => {
                    computedPlaceholder.value = virtualPlaceholder.value!.offsetWidth < virtualPlaceholder.value!.scrollWidth
                        ? props.placeholderFallback(n)
                        : placeholder
                    virtualPlaceholder.value!.innerText = ''
                }
                if (floatLabelEnabled.value && !computedPlaceholder.value) setTimeout(updatePlaceholder, 75)
                else updatePlaceholder()
            } else {
                computedPlaceholder.value = floatLabelEnabled.value ? '' : props.placeholder
            }
        }
    } else {
        const walker = createOptionsWalker(option => model.value === option.value)
        const input = (walker.nextNode() as HTMLElement | null)?.firstElementChild as HTMLInputElement
        selected.value = input
        if (input?.checked) {
            const updatePlaceholder = () => {
                computedPlaceholder.value = (input.parentElement!.querySelector('& > .toggle-label') as HTMLElement).innerText
            }
            if (floatLabelEnabled.value && !computedPlaceholder.value) setTimeout(updatePlaceholder, 75)
            else updatePlaceholder()
            if (closeOnUpdated) closePopover()
        } else {
            computedPlaceholder.value = floatLabelEnabled.value ? '' : props.placeholder
        }
    }
}
</script>

<template>
    <FormField :class="['select', props.class]"
        :label :hint :description :help :float-label="floatLabelEnabled"
        :theme :size :radius :spacing
        :showErrors :errors="model.errors"
    >
        <Popover :class="['select-popover', props.class]"
            :theme :size :radius :spacing
            @keydown="handleSelectKeydown"
        >
            <Btn
                v-bind="$attrs"
                type="button"
                :class="['select-button', {
                    selected: isSelected,
                    invalid: model.error
                }]"
                descendant
                mask="form-field"
                outline="subtle"
                icon-right="keyboard_arrow_down"
                :fill
                :underline
                :disabled
                :squared="false"
                @click="handleBtnClick"
                @keydown="handleSelectKeydown"
            >
                <div v-if="chips && isMultiSelect && isSelected" class="chips">
                    <Badge v-for="input of (selected as Set<HTMLInputElement>).values()" :key="input.value"
                        descendant
                        variant="subtle"
                        outline="subtle"
                        :squared="false"
                        >
                        {{ input.dataset.label }}
                        <button type="button" :data-value="input.value">
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
                    descendant
                    :placeholder="filterInput?.placeholder ?? vergil.config.select.placeholderFilter"
                    :icon="filterInput?.icon ?? 'search'"
                    @input="handleFilterInput"
                />
                <p v-if="empty" class="select-not-found">
                    <MiniMarkup :str="placeholderNotFound(filterModel.value)"/>
                </p>
                <CheckboxGroup v-show="!empty"
                    descendant
                    :model-value="model"
                    :eagerValidation
                    :options
                    :optionValue
                    :optionLabel
                    :optionDescription
                    :disabled
                    :show-symbol="isMultiSelect"
                    @change="handleChange"
                    variant="list"
                    tabindex="-1"
                    :options-attributes="(key: string, value: string, label: string, description: string) => ({
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
    &:hover > .btn-content > .chips > .badge {
        box-shadow: none;
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
            font-size: calc(0.9 * var(--font-size));
            line-height: calc(var(--line-height-text) / 0.9);
            display: flex;
            flex-wrap: wrap;
            gap: var(--g-gap-xs) var(--g-gap-sm);
            & > .badge {
                font-size: calc(0.9 * var(--font-size));
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
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    border: none;
                    background-color: transparent;
                    color: inherit;
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
        padding: var(--g-gap-md) var(--g-gap-2xl);
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
    border-radius: var(--g-radius-md);
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
        font-size: var(--font-size);
        padding: var(--g-gap-md) var(--g-gap-2xl);
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
            padding: var(--g-gap-sm) var(--g-gap-2xl);
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