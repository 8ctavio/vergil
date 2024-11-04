import { ref, shallowRef, markRaw, nextTick } from 'vue'

const popupIsLeaving = ref(false)
const popup = shallowRef({
    component: null,
    props: {}
})

async function showPopup(component, props){
    if(popup.value.component){
        popupIsLeaving.value = true
        await nextTick()
    }
    popup.value = {
        component: markRaw(component),
        props
    }
}
async function closePopup(closeBtn = false){
    const onClose = popup.value.props?.onClose
    popupIsLeaving.value = true
    await nextTick()
    popup.value = {
        component: null,
        props: {}
    }
    if(closeBtn) onClose?.()
}

export {
    popup,
    showPopup,
    closePopup,
    popupIsLeaving
}