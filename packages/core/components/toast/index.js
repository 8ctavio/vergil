import { reactive } from 'vue'
import { vergil } from '../../vergil'
import { inferTheme } from "../../functions/utils"

const toasters = reactive({})
function toast(){
    let theme
    let args = {}
    if(arguments.length > 1){
        theme = inferTheme(arguments[0])
        args.message = arguments[1]
    }
    else if(typeof arguments[0] === 'string'){
        args.message = arguments[0]
    }
    else{
        if(arguments[0]?.theme) theme = inferTheme(arguments[0].theme)
        args = arguments[0]
    }
    const position = 
        vergil.config.toaster.positions.includes(args?.position) ? args.position
        : vergil.config.toaster.positions.includes(vergil.config.toaster.position) ? vergil.config.toaster.position
        : vergil.config.toaster.positions[0]
    toasters[position]?.unshift({
        id: Date.now().toString(),
        message: args?.message ?? '',
        details: args?.details ?? '',
        theme,
        icon: args?.icon,
        duration: args?.duration ?? vergil.config.toaster.duration
    })
}

export {
    toasters,
    toast
}