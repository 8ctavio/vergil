import { shallowRef, shallowReactive, markRaw, nextTick } from 'vue'

const popup = shallowRef({
    component: null,
    props: {}
})
const popupMeta = shallowReactive({
    isLeaving: false,
    focusedBefore: null
})

async function showPopup(component, props){
    if(popup.value.component){
        popupMeta.isLeaving = true
        await nextTick()
    }
    popup.value = {
        component: markRaw(component),
        props
    }
}
async function closePopup(closeBtn = false){
    const onClose = popup.value.props?.onClose
    popupMeta.isLeaving = true
    await nextTick()
    popupMeta.focusedBefore = null
    popup.value = {
        component: null,
        props: null
    }
    if(closeBtn) onClose?.()
}

export {
    popup,
    popupMeta,
    showPopup,
    closePopup,
}