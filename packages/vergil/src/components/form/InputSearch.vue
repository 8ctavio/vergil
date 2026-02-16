<script setup lang="ts">
import { shallowRef, triggerRef, computed, watchEffect, nextTick } from 'vue'
import { vergil } from '#vergil'
import { useDefineModel, useDefineExposed } from '#composables'
import { ucFirst } from '#utilities'
import InputText from '#components/form/InputText.vue'
import type { PropType } from 'vue'
import type { ModelValueProp, Elements, Exposed } from '#composables'

const props = defineProps({
    //----- Model -----
	value: {
		type: String,
		default: ''
	},
	modelValue: {
		type: [String, Object] as ModelValueProp<string>,
		default: (props: { value: string }) => props.value
	},
    ['onUpdate:modelValue']: Function,
    elements: Object as PropType<Elements>,
    exposed: Object as PropType<Exposed>,

    iconSearch: {
        type: String,
        default: 'search'
    },
    iconClear: {
        type: String,
        default: 'search_off'
    },
    buttonPosition: {
        type: String as PropType<'before' | 'after'>,
        default: () => vergil.config.inputSearch.buttonPosition,
        validator: (v: string) => ['before', 'after'].includes(v)
    },
    buttonBefore: Object,
    buttonAfter: Object,
    disabled: Boolean,
    onSearch: Function as PropType<(searchQuery: string) => void>,
})
const emit = defineEmits<{ clear: [] }>()

const model = useDefineModel<string, false, false, true, true>({
    includeElements: true,
    captureElements: true
})

const loader = shallowRef(false)
const lastSearch = shallowRef('')

function handleSearch() {
    loader.value = true
    const searchQuery = model.value
    let focused: Element | null
    queueMicrotask(() => {
        focused = document.activeElement
    })
    Promise.resolve(props.onSearch?.(searchQuery)).finally(() => {
        lastSearch.value = searchQuery
        loader.value = false
        nextTick(() => {
            if (focused === document.activeElement) {
                (model.elements.input as HTMLElement).focus()
            }
        })
    })
}
function handleEnter() {
    if (model.value) {
        handleSearch()
    } else {
        lastSearch.value = ''
    }
}

const icon = computed(() => {
    return !model.value || model.value !== lastSearch.value
        ? props.iconSearch
        : props.iconClear
})

const buttonData = {} as {
    searchButtonProp: string;
    normalButtonProp: 'buttonBefore' | 'buttonAfter';
    normalButtonProps?: Record<string, unknown>
}
const buttonDataSignal = shallowRef(buttonData)
watchEffect(() => {
    const position = props.buttonPosition
    buttonData.searchButtonProp = `button${ucFirst(position)}`
    buttonData.normalButtonProp = position === 'before' ? 'buttonAfter' : 'buttonBefore'
    buttonData.normalButtonProps = props[buttonData.normalButtonProp]
    triggerRef(buttonDataSignal)
})

const searchButtonProps = computed(() => {
    const position = props.buttonPosition
    const buttonProps = props[`button${ucFirst(position) as 'Before' | 'After'}`] ?? {}
    buttonProps.variant ??= 'subtle'
    buttonProps.outline ??= 'subtle'
    const searchButtonProps = {
        ...buttonProps,
        type: 'button',
        icon: undefined,
        onClick() {
            if (model.value) {
                if (model.value === lastSearch.value) {
                    emit('clear')
                    model.value = ''
                    lastSearch.value = ''
                } else {
                    handleSearch()
                }
            } else {
                lastSearch.value = ''
            }
        }
    }

    /**
     * Since icon and loader change frequently, it is desired to
     * prevent creating search button props objects every time they
     * change. Ideally, there would be better support for ref
     * objects. Instead, accessor getters are defined to manually
     * unwrap refs.
     */
    Object.defineProperties(searchButtonProps, {
        [position === 'after' ? 'iconLeft' : 'iconRight']: {
            get: () => icon.value,
            enumerable: true
        },
        loading: {
            get: () => loader.value,
            enumerable: true
        }
    })

    return searchButtonProps
})

useDefineExposed({
    clear() {
        if(model.value) {
            model.value = ''
            emit('clear')
        }
        lastSearch.value = ''
    }
})
</script>

<template>
    <InputText
        class="input-search"
        :model-value="model"
        :[buttonDataSignal.searchButtonProp]="searchButtonProps"
        :[buttonDataSignal.normalButtonProp]="buttonDataSignal.normalButtonProps"
        :disabled="disabled || loader"
        @keyup.enter="handleEnter"
    />
</template>