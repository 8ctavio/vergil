import { ref, toValue  } from 'vue'

class ExtendedRef{
    #value = ref()
    get value(){ return this.#value.value }
    set value(newValue){
        const oldValue = this.#value.value
        this.#value.value = newValue
        this.#onUpdated(newValue, oldValue)
    }
    get ref(){ return this.#value }

    #reference
    constructor(reference, hooks = {}){
        this.#reference = reference
        this.reset()
        this.setHooks(hooks)
    }

    reset(){
        const oldValue = this.value
        this.value = structuredClone(toValue(this.#reference))
        const newValue = this.value
        this.#onReset(newValue, oldValue)
    }

    //---------- HOOKS ----------
    #onUpdated = () => {}
    onUpdated(callback){
        this.#onUpdated = callback
        return this
    }

    #onReset = () => {}
    onReset(callback){
        this.#onReset = callback
        return this
    }

    setHooks(hooks){
        Object.keys(hooks).forEach(hook => {
            if(['onUpdated', 'onReset'].includes(hook)){
                this[hook](hooks[hook])
            }
        })
    }
}

const extRef = (...args) => new ExtendedRef(...args)

export {
    extRef,
    ExtendedRef
}