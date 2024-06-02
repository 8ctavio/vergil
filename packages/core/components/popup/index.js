import { shallowRef, markRaw } from 'vue'

const popup = shallowRef({
    component: null,
    props: {}
})

function showPopup(component, props){
    popup.value = {
        component: markRaw(component),
        props
    }
}
function closePopup(closeBtn = false){
    if(closeBtn) popup.props?.onClose?.()
    popup.value = {
        component: null,
        props: {}
    }
}

export {
    popup,
    showPopup,
    closePopup
}