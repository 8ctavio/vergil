const gap = 15
const icons = {
    ok: 'check_circle',
    error: 'cancel',
    warn: 'warning',
    info: 'info'
}
export function toast(type, message, duration = 6){
    const toaster = document.getElementById("toaster")
    const toasts = toaster.getElementsByClassName("toast")

    const newToast = document.createElement("div")
    newToast.classList.add("toast", type)

    const icon = document.createElement("span")
    icon.classList.add("material-icons-round")
    icon.textContent = icons[type] ? icons[type] : 'help'

    const msg = document.createElement("p")
    msg.textContent = message
    
    newToast.append(icon, msg)
    toaster.appendChild(newToast)

    newToast.style['bottom'] = '40px'
    for(let i=0; i<toasts.length-1; i++){
        let currentBottom = Number(toasts[i].style['bottom'].split('px')[0])
        toasts[i].style['bottom'] = `${currentBottom + gap + newToast.offsetHeight}px`
    }

    newToast.classList.add('enter')

    setTimeout(() => {
        newToast.classList.remove('enter')
        if(toasts.length == 1) newToast.classList.add('leave')
        else{
            let currentBottom = Number(newToast.style['bottom'].split('px')[0])
            newToast.style['opacity'] = `0`
            if(newToast == toaster.firstChild) newToast.style['bottom'] = `${currentBottom + 40}px`
        }
        // If the toast leaving is not the one at the top of the stack, adjust bottom property for the toasts above.
        if(newToast != toaster.firstChild){
            for(let i=0; i < toasts.length - 1; i++){
                let currentBottom = Number(toasts[i].style['bottom'].split('px')[0])
                toasts[i].style['bottom'] = `${currentBottom - gap - newToast.offsetHeight}px`
                if(newToast == toasts[i+1]) break
            }
        }
        setTimeout(() => {
            toaster.removeChild(newToast)
        }, 500)
    }, duration*1000)
}