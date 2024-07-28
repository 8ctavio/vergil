import { reactive } from 'vue'
import { vergil } from '../../vergil'
import { inferTheme } from "../../utilities/private"

const toasters = reactive({})
function toast(...args){
    let theme
    let options = {}
    if(args.length > 1){
        theme = inferTheme(args[0])
        options.message = args[1]
    }
    else if(typeof args[0] === 'string'){
        options.message = args[0]
    }
    else{
        if(args[0]?.theme) theme = inferTheme(args[0].theme)
        options = args[0]
    }
    const position = 
        vergil.config.toaster.positions.includes(options?.position) ? options.position
        : vergil.config.toaster.positions.includes(vergil.config.toaster.position) ? vergil.config.toaster.position
        : vergil.config.toaster.positions[0]
    toasters[position]?.unshift({
        id: Date.now().toString(),
        message: options?.message ?? '',
        details: options?.details ?? '',
        theme,
        icon: options?.icon,
        duration: options?.duration ?? vergil.config.toaster.duration
    })
}

export {
    toasters,
    toast
}