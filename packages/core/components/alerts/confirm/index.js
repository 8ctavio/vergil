import { ref } from 'vue'

export const confirmContent = ref({})
const icons = {
    ok: 'check_circle',
    error: 'cancel',
    warn: 'warning',
    info: 'info'
}
export function confirm(style, {header, body, priBtnTxt = 'Aceptar', secBtnTxt = 'Cancelar'}, accept, decline){
    const background = document.querySelector('#confirm')
    if(background.hasAttribute('style')) clearTimeout(timeout)
    const confirm = document.querySelector('#confirm > div')
    const acceptBtn = document.getElementById('acceptBtn')
    const declineBtn = document.getElementById('declineBtn')

    
    confirmContent.value = {
        style,
        icon: icons[style],
        header,
        body,
        priBtnTxt,
        secBtnTxt
    }

    background.style['display'] = 'flex'
    setTimeout(() => {
        background.style['opacity'] = '1'
        confirm.classList.add('animation')
    }, 50)

    const onAccept = async () => {
        hideConfirm()
        removeListeners()
        await accept()
    }
    const onDecline = async () => {
        hideConfirm()
        removeListeners()
        await decline?.()
    }
    const removeListeners = () => {
        acceptBtn.removeEventListener('click', onAccept)
        declineBtn.removeEventListener('click', onDecline)
    }
    acceptBtn.addEventListener('click', onAccept)
    declineBtn.addEventListener('click', onDecline)
    
    const hideConfirm = () => {
        confirm.classList.remove('animation')
        background.style['opacity'] = '0'
        setTimeout(() => {
            background.removeAttribute('style')
            confirmContent.value = {}
        }, 500)
    }	
}