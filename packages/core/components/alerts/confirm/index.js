import { ref, nextTick } from 'vue'

const open = ref(false)
const body = ref(null)

const confirmContent = ref({})

const waitingConfirmation = ref(false)
const resolveConfirm = ref(() => {})

const icons = {
    danger: 'cancel',
    caution: 'warning',
    ack: 'info',
    check: 'check_circle'
}

export async function confirm(type, {header, content, confirmLabel = 'Aceptar', declineLabel = 'Cancelar'}){
    if(!waitingConfirmation.value){
        confirmContent.value = {
            type,
            icon: icons[type],
            header,
            content,
            confirmLabel,
            declineLabel
        }
        await nextTick()
    }
    
    open.value = true
    // body.value?.classList.add('prevent-overflow')

    if(waitingConfirmation.value) return null

    return new Promise(resolve => {
        waitingConfirmation.value = true
        resolveConfirm.value = resolve
    })
}

export{
    open, body,
    confirmContent,
    resolveConfirm,
    waitingConfirmation
}