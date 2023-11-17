import { ref, watch, toValue } from 'vue'
import { ExtendedRef } from './extRef'
import { isWatchSource } from '../functions'

class InputField extends ExtendedRef{
    #elm = ref(null)
    get elm(){ return this.#elm.value }
    get elmRef(){ return this.#elm }

    #disabled = ref(false)
    get disabled(){ return this.#disabled.value }
    disable(){ this.#disabled.value = true }
    enable(){ this.#disabled.value = false }

    #error = ref(false)
    get error(){ return this.#error.value }
    err(e = true){
        if(e){
            if(!this.#error.value){
                this.#error.value = true
                this.elm.addEventListener('focus', this)
                this.elm.addEventListener('keydown', this)
            }
        }
        else this.handleEvent()
    }

    constructor(...args){
        super(...args)
    }
    handleEvent(){
        this.#error.value = false
        this.elm.removeEventListener('focus', this)
        this.elm.removeEventListener('keydown', this)
    }
}

class FormFields{
    #id
    #fields

    #errMsg = ref('')
    get errMsg(){ return this.#errMsg.value }
    set errMsg(msg){ this.#errMsg.value = msg }

    constructor(source){
        const { id, ...fields } = toValue(source)
        this.#id = id
        this.#fields = Object.keys(fields)
        this.#fields.forEach(field => { 
            this[field] = new InputField(fields[field])
        })
        if(isWatchSource(source)){
            watch(source, ({newId, ...newFields}) => {
                this.#id = newId
                this.#fields.forEach(field => {
                    this[field].reference = newFields[field]
                })
            })
        }
    }

    get payload(){
        const payload = {}
        if(this.#id) payload.id = this.#id
        this.#fields.forEach(field => { payload[field] = this[field].value })
        return payload
    }

    get changed(){
        return this.#fields.some(field => {
            if(['string', 'boolean'].includes(typeof this[field].value)) return this[field].value !== this[field].reference
            else if(Array.isArray(this[field].value)){
                if(this[field].value.length !== this[field].reference.length) return true
                else return this[field].value.some(v => this[field].reference.includes?.(v) === false)
            }
        })
    }

    reset = () => {
        this.#fields.forEach(field => this[field].reset())
        this.errMsg = ""
    }
}

export {
    InputField,
    FormFields
}