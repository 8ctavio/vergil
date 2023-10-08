import { ref, markRaw } from 'vue'
import { body } from '../../utils/shared'

const popUp = ref({
    component: null,
    props: {}
})

let popUpOnClose = () => {}
function showPopUp(component, props){
    // body.value?.classList.add('prevent-overflow')
    popUp.value = {
        component: markRaw(component),
        props
    }
    popUpOnClose = () => {}
    return {
        onClose(callback){
            popUpOnClose = callback
        }
    }
}

function closePopUp(){
    popUp.value = {
        component: null,
        props: {}
    }
    // body.value?.classList.remove('prevent-overflow')
    popUpOnClose?.()
    popUpOnClose = () => {}
}

export {
    popUp,
    showPopUp,
    closePopUp
}