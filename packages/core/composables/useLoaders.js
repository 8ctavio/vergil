import { ref, readonly, onUnmounted } from 'vue'

const globalDisabler = ref(false)
const globalDisablerCopy = readonly(globalDisabler)

class Loader{
    #loading = ref(false)
    get loading(){ return this.#loading.value }
    constructor(initialValue){
        this.state = initialValue
    }
    on(){
        globalDisabler.value = true
        this.#loading.value = true
    }
    off(){
        this.#loading.value = false
        updateGlobalDisabler()
    }
    toggle(){ 
        if(this.loading) this.off()
        else this.on()    
    }
}

class ScreenLoader extends Loader{
    #label = ref('')
    get label(){ return this.#label.value }
    set label(v){ this.#label.value = v }
    constructor(initialValue){
        super(initialValue)
    }
}

const screenLoader = new ScreenLoader(false)

let loaders = [screenLoader]

const updateGlobalDisabler = () => {
    globalDisabler.value = loaders.some(loader => {
        if(loader instanceof Loader)
            return loader.state
        else if(loader !== null && typeof loader === 'object')
            return Object.keys(loader).some(loaderName => loader[loaderName].state)
        else
            return false
    })
}

const useLoaders = initialValue => {
    let newLoader = {}
    if(typeof initialValue === 'boolean') newLoader = new Loader(initialValue)
    else if(initialValue !== null && typeof initialValue === 'object'){
        for(let loaderName in initialValue){
            newLoader[loaderName] = new Loader(initialValue[loaderName])
        }
    }
    loaders.push(newLoader)
    const detachLoaders = () => {
        loaders = loaders.filter(loader => loader !== newLoader)
        updateGlobalDisabler()
    }
    onUnmounted(() => {
        detachLoaders()
    })
    return newLoader
}

export {
    globalDisablerCopy as globalDisabler,
    useLoaders,
    screenLoader
}