<script setup>
import InputText from './InputText.vue'
import { computed, shallowRef, nextTick } from 'vue'
import { vergil } from '../../vergil'
import { useDefineModel, useDefineExposed, extendedReactive } from '../../composables'
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

const model = useDefineModel(props, { captureElements: true })

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

/**
 * @Note reactive btnPosition
 *  const btnProps = shallowRef({})
 *  watch(() => props.btnPosition, p => {
 *      btnProps.value = {
 *          // Add updated properties
 *      }
 *  })
 */
const btnPositionFlag = props.btnPosition === 'after'
const btnPositionName = ucFirst(props.btnPosition)
const btnProps = extendedReactive(withDescriptor => ({
    iconLeft: btnPositionFlag ? icon : props[`btn${btnPositionName}`]?.iconLeft,
    iconRight: btnPositionFlag ? props[`btn${btnPositionName}`]?.iconRight : icon,
    loading: loader,
    onClick: withDescriptor({
        value() {
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
        },
        enumerable: true
    }),
    label: props[`btn${btnPositionName}`]?.label,
    variant: props[`btn${btnPositionName}`]?.variant ?? 'subtle',
    ghost: props[`btn${btnPositionName}`]?.ghost,
    outline: props[`btn${btnPositionName}`]?.outline ?? 'subtle',
    underline: props[`btn${btnPositionName}`]?.underline,
    fill: props[`btn${btnPositionName}`]?.fill,
    squared: props[`btn${btnPositionName}`]?.squared,
}))

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
        :btn-before="btnPositionFlag ? btnBefore : btnProps"
        :btn-after="btnPositionFlag ? btnProps : btnAfter"
        :disabled="disabled || loader"
        @keyup.enter="handleEnter"
    />
</template>