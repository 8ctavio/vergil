import { reactive } from 'vue'
import { inferTheme, themeIcons } from "../../functions/utils"

const toasterPositions = [
    'top-start',
    'top',
    'top-end',
    'bottom-start',
    'bottom',
    'bottom-end'
]
const toasters = reactive({})
toasterPositions.forEach(position => {
    toasters[position] = []
})
function toast(){
    let theme = 'brand'
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
    const position = toasterPositions.includes(args?.position) ? args.position : 'bottom-end'
    toasters[position].unshift({
        id: Date.now().toString(),
        message: args?.message ?? '',
        details: args?.details ?? '',
        theme,
        icon: args?.icon ?? themeIcons[theme],
        duration: args?.duration ?? 6
    })
}

export {
    toasters,
    toasterPositions,
    toast
}