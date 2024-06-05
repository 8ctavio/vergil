const reAlphabetic = /^[\p{L}\s]+$/u
const reNotAlphabetic = /[^\p{L}\s]/u

const reAlphanumeric = /^[\p{L}\d\s-]+$/u
const reNotAlphanumeric = /[^\p{L}\d\s-]/u

const reSentence = /^[\p{L}\d\s,.'-]*$/u
const reNotSentence = /[^\p{L}\d\s,.'-]/u

const reNumber = /^-?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/
const reNumeric = /^[\d\s]+$/
const reNotNumeric = /[^\d\s]/
const reDigits = /^\d+$/
const reNotDigit = /\D/

const reEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

export {
    reAlphabetic,
    reNotAlphabetic,
    reAlphanumeric,
    reNotAlphanumeric,
    reSentence,
    reNotSentence,
    reNumber,
    reNumeric,
    reNotNumeric,
    reDigits,
    reNotDigit,
    reEmail
}