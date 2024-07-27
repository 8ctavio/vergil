<script setup>
import InputText from './InputText.vue'
import { ref, computed } from 'vue'
import { extendedReactive } from '../../composables/extendedReactive'
import { useModel } from '../../composables/useModel'
import { isModel } from '../../functions'

const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    modelValue: {
        default: props => useModel(props.value),
        validator: isModel
    },
    onSearch: Function,
    btnAfter: Object,
    iconSearch: {
        type: String,
        default: 'search'
    },
    iconClear: {
        type: String,
        default: 'search_off'
    },
    disabled: Boolean,
})
const emit = defineEmits(['clear'])

const model = useModel(props.modelValue)

const loader = ref(false)

const lastSearch = ref('')

async function handleSearch(){
    loader.value = true
    const searchQuery = model.value
    await props.onSearch?.(searchQuery)
    lastSearch.value = searchQuery
    loader.value = false
}

function handleEnter(){
    if(model.value){
        handleSearch()
    } else {
        lastSearch.value = ''
    }
}

const icon = computed(() => {
    return (
        !(model.value || model.value === lastSearch.value)
        || (model.value && model.value === lastSearch.value)
    ) ? props.iconClear : props.iconSearch
})
const btnProps = extendedReactive({
    icon,
    loading: loader,
    onClick(){
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
    label: props.btnAfter?.label,
    variant: props.btnAfter?.variant ?? 'outline',
    fill: props.btnAfter?.fill,
    borderless: props.btnAfter?.borderless,
    squared: props.btnAfter?.squared,
    iconRight: props.btnAfter?.iconRight,
})

function clear(){
    emit('clear')
    model.value = ''
    lastSearch.value = ''
}
</script>

<template>
    <InputText
        :model-value="model"
        :btn-after="btnProps"
        @keyup.enter="handleEnter"
        :disabled="disabled || loader"
        />
</template>