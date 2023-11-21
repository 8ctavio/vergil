const gap = 15
const icons = {
    ok: 'check_circle',
    error: 'cancel',
    warn: 'warning',
    info: 'info'
}
export function alert(type, message, duration = 6){
    const alertFeed = document.getElementById("alertFeed")
    const alerts = alertFeed.getElementsByClassName("alert")
    
    const newAlert = document.createElement("div")
    newAlert.classList.add("alert", type)
    
    const icon = document.createElement("span")
    icon.classList.add("material-symbols-rounded")
    icon.textContent = icons[type] ? icons[type] : 'help_outline'

    const msg = document.createElement("p")
    msg.textContent = message
    
    const closeBtn = document.createElement("button")
    closeBtn.addEventListener('click', hideAlert)
    
    const closeX = closeBtn.appendChild(document.createElement('span'))
    closeX.classList.add("material-symbols-rounded")
    closeX.textContent = "cancel"

    newAlert.append(icon, msg, closeBtn)
    alertFeed.appendChild(newAlert)

    newAlert.style['top'] = `${gap}px`
    for(let i=0; i<alerts.length-1; i++){
        let currentTop = Number(alerts[i].style['top'].split('px')[0])
        alerts[i].style['top'] = `${currentTop + gap + newAlert.offsetHeight}px`
    }

    newAlert.classList.add('enter')

    let timeout = setTimeout(() => {
        hideAlert()
    }, duration*1000)

    function hideAlert(){
        clearTimeout(timeout)
        closeBtn.removeEventListener('click', hideAlert)
        newAlert.classList.remove('enter')
        if(alerts.length == 1) newAlert.classList.add('leave')
        else{
            let currentTop = Number(newAlert.style['top'].split('px')[0])
            newAlert.style['opacity'] = `0`
            if(newAlert == alertFeed.firstChild) newAlert.style['top'] = `${currentTop + gap}px`
        }
        // If the alert leaving is not the one at the bottom of the stack, adjust top property for the alerts below.
        if(newAlert != alertFeed.firstChild){
            for(let i=0; i < alerts.length - 1; i++){
                let currentTop = Number(alerts[i].style['top'].split('px')[0])
                alerts[i].style['top'] = `${currentTop - gap - newAlert.offsetHeight}px`
                if(newAlert == alerts[i+1]) break
            }
        }
        setTimeout(() => {
            alertFeed.removeChild(newAlert)
        }, 500)
    }
}