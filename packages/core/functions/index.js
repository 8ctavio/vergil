import { isRef } from 'vue'
import { reWords } from './regex'

//------------------------------------------------
//-------------------- STRING --------------------
//------------------------------------------------
function ucFirst(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}
function spaceEvenly(str, separator = " "){
    return str.trim().replace(/\s+/g, separator)
}
function deburr(str){
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

function words(string){
    return string.match(reWords) || []
}
function formatString(string, formatWord, separator = " "){
    return words(string).reduce((formatedString, word, i) => formatedString + (i?separator:"") + formatWord(word, i), "")
}

function sentenceCase(string){
    return formatString(string, (word, i) => i ? word.toLowerCase() : ucFirst(word.toLowerCase()))
}
function startCase(string){
    return formatString(string, word => ucFirst(word.toLowerCase()))
}
function kebabCase(string){
    return formatString(string, word => deburr(word).toLowerCase(), "-")
}

//------------------------------------------------
//-------------------- NUMBER --------------------
//------------------------------------------------
function separateThousands(num, separator = ','){
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, separator)
}

function formatPhone(phone){
    return phone.length === 10 ? `${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}` : phone
}

//----------------------------------------------
//-------------------- DATE --------------------
//----------------------------------------------
function getTimestamp({ units = 'ms', from = Date.now(), offset = {} } = {}){
    if(typeof units !== 'string' || !['s', 'ms'].includes(units)) throw new TypeError("Invalid string for 'units'")

    const { s = 0, m = 0, h = 0, d = 0 } = offset
    const delta = (s + (m + (h + d*24)*60)*60)*1000
    return Math.floor((from + delta)/({s: 1000, ms: 1}[units]))
}

const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Sábado']
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const formatDate = (timestamp, { units = 'ms', format = 'short' } = {}) => {
    if(typeof units !== 'string' || !['s', 'ms'].includes(units)) throw new TypeError("Invalid string for 'units'")
    
    const date = new Date(timestamp*(units === 'ms' ? 1 : 1000))
    const weekday = weekdays[date.getDay()]
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    switch(format){
        case 'short':
            return `${day}/${month.toString().padStart(2, '0')}/${year}`
        case 'long':
            return `${day} de ${months[month-1]} de ${year}`
    }
}

//-----------------------------------------------
//-------------------- ERROR --------------------
//-----------------------------------------------
class AppError extends Error{
    constructor({
        type,
        code = '',
        details,
        log,
        message
    }){
        super(message)
        this.type = type
        this.code = code
        this.details = details
        console.error(`∮ ${log}`)
    }
}

//---------------------------------------------
//-------------------- REF --------------------
//---------------------------------------------
const isWatchSource = maybeWatchSource => isRef(maybeWatchSource) || (typeof maybeWatchSource === 'function')

export{
    ucFirst,
    spaceEvenly,
    deburr,
    sentenceCase,
    startCase,
    kebabCase,
    separateThousands,
    formatPhone,
    getTimestamp,
    formatDate,
    AppError,
    isWatchSource
}