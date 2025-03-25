<script setup>
import InputText from './InputText.vue'
import { shallowRef, triggerRef, computed, watchEffect, nextTick } from 'vue'
import { vergil } from '../../vergil'
import { useDefineModel, useDefineExposed } from '../../composables'
import { ucFirst } from '../../utilities'

const props = defineProps({
    //----- Model -----
	value: {
		type: String,
		default: ''
	},
	modelValue: {
		type: [String, Object],
		default: props => props.value
	},
    ['onUpdate:modelValue']: Function,
    elements: Object,
    exposed: Object,

    iconSearch: {
        type: String,
        default: 'search'
    },
    iconClear: {
        type: String,
        default: 'search_off'
    },
    btnPosition: {
        type: String,
        default: () => vergil.config.inputSearch.btnPosition,
        validator: v => ['before', 'after'].includes(v)
    },
    btnBefore: Object,
    btnAfter: Object,
    disabled: Boolean,
    onSearch: Function,
})
const emit = defineEmits(['clear'])

const model = useDefineModel({
    includeElements: true,
    captureElements: true
})

const loader = shallowRef(false)
const lastSearch = shallowRef('')

function handleSearch() {
    loader.value = true
    const searchQuery = model.value
    let focused
    queueMicrotask(() => {
        focused = document.activeElement
    })
    Promise.resolve(props.onSearch?.(searchQuery)).finally(() => {
        lastSearch.value = searchQuery
        loader.value = false
        nextTick(() => {
            if(focused === document.activeElement) {
                model.elements.input.focus()
            }
        })
    })
}
function handleEnter() {
    if(model.value) {
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

const btnData = {}
const btnDataSignal = shallowRef(btnData)
watchEffect(() => {
    const position = props.btnPosition
    btnData.searchBtnProp = `btn${ucFirst(position)}`
    btnData.normalBtnProp = position === 'before' ? 'btnAfter' : 'btnBefore'
    btnData.normalBtnProps = props[btnData.normalBtnProp]
    triggerRef(btnDataSignal)
})

const searchBtnProps = computed(() => {
    const position = props.btnPosition
    const btnProps = props[`btn${ucFirst(position)}`] ?? {}
    btnProps.variant ??= 'subtle'
    btnProps.outline ??= 'subtle'
    const searchBtnProps = {
        ...btnProps,
        type: 'button',
        icon: undefined,
        onClick() {
            if(model.value){
                if(model.value === lastSearch.value){
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
    Object.defineProperties(searchBtnProps, {
        [position === 'after' ? 'iconLeft' : 'iconRight']: {
            get: () => icon.value,
            enumerable: true
        },
        loading: {
            get: () => loader.value,
            enumerable: true
        }
    })

    return searchBtnProps
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
        :[btnDataSignal.searchBtnProp]="searchBtnProps"
        :[btnDataSignal.normalBtnProp]="btnDataSignal.normalBtnProps"
        :disabled="disabled || loader"
        @keyup.enter="handleEnter"
    />
</template>