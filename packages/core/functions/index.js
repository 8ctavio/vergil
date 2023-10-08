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
const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Sábado']
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const formatDate = (timestamp, format = 'short') => {
    const date = new Date(timestamp*1000)
    let weekday = weekdays[date.getDay()]
    let day = date.getDate().toString().padStart(2, '0')
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    switch(format){
        case 'short':
            return `${day}/${month.toString().padStart(2, '0')}/${year}`
        case 'long':
            return `${day} de ${months[month-1]} de ${year}`
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
    formatDate,
    isWatchSource
}