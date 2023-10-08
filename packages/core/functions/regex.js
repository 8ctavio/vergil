const reWords = /[\d\p{L}]+/gu

const reSentence = /^[\p{L}\s]+$/u
const reNotSentence = /[^\p{L}\s]+/u
const reNotAlphanumericSentence = /[^\d\p{L}\s]+/u
const reNotDigit = /\D+/
const reNumeric = /^[\d\s]+$/
const reNotNumeric = /[^\d\s]+/

const reEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

export {
    reWords,
    reSentence,
    reNotSentence,
    reNotAlphanumericSentence,
    reNotDigit,
    reNumeric,
    reNotNumeric,
    reEmail
}