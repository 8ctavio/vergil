import { ref, readonly, onUnmounted } from 'vue'

const globalDisabler = ref(false)
const globalDisablerCopy = readonly(globalDisabler)

class Loader{
    constructor(initialValue){
        this.state = ref(initialValue)
    }
    on(){
        globalDisabler.value = true
        this.state.value = true
    }
    off(){
        this.state.value = false
        updateGlobalDisabler()
    }
    toggle(){ 
        if(this.state.value) this.off()
        else this.on()    
    }
}

class ScreenLoader extends Loader{
    constructor(initialValue){
        super(initialValue)
        this.label = ref('')
    }
}

const screenLoader = new ScreenLoader(false)

let loaders = [screenLoader]

const updateGlobalDisabler = () => {
    let flag = false
    for(const loader of loaders){
        if(typeof loader === 'object'){
            if(loader instanceof Loader){
                flag = loader.state.value
                if(flag) break
            }
            else{
                for(const loaderName of Object.keys(loader)){
                    if(loader[loaderName] instanceof Loader){
                        flag = loader[loaderName].state.value
                        if(flag) break
                    }
                    if(flag) break
                }
            }
        }
    }
    globalDisabler.value = flag
}

const attachLoaders = initialValue => {
    if(['boolean', 'object'].includes(typeof initialValue)){
        let newLoader = {}
        if(typeof initialValue === 'boolean') newLoader = new Loader(initialValue)
        else if(typeof initialValue === 'object'){
            for(let key in initialValue){
                newLoader[key] = new Loader(initialValue[key])
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
}

export {
    globalDisablerCopy as globalDisabler,
    screenLoader,
    attachLoaders
}