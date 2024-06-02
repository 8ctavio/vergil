import { shallowReactive, markRaw } from 'vue'

const popup = shallowReactive({
    show: false,
    component: null,
    props: {}
})

function showPopup(component, props){
    popup.component = markRaw(component)
    popup.props = props
    popup.show = true
}
function closePopup(closeBtn = false){
    popup.show = false
    if(closeBtn) popup.props?.onClose?.()
}
function cleanPopup(){
    popup.component = null
    popup.props = {}
}

export {
    popup,
    showPopup,
    closePopup,
    cleanPopup
}