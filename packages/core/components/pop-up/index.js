import { ref, readonly, markRaw } from 'vue'
import { body } from '../../utils/shared'

const popUp = ref(null)
const popUpCopy = readonly(popUp)

const popUpContent = ref(null)
const popUpContentCopy = readonly(popUpContent)

let popUpOnClose = () => {}
export function showPopUp(popUpComponent, content = null){
    // body.value?.classList.add('prevent-overflow')
    popUp.value = markRaw(popUpComponent)
    popUpContent.value = content
    popUpOnClose = () => {}
    return {
        onClose(callback){
            popUpOnClose = callback
        }
    }
}

export function closePopUp(){
    popUp.value = null
    // body.value?.classList.remove('prevent-overflow')
    popUpContent.value = null
    popUpOnClose?.()
    popUpOnClose = () => {}
}

export {
    popUpCopy as popUp,
    popUpContentCopy as popUpContent
}