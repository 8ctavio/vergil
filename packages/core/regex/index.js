export const reAlphabetic = /^[\p{L}\s]+$/u
export const reNotAlphabetic = /[^\p{L}\s]/u

export const reAlphanumeric = /^[\p{L}\d-\s]+$/u
export const reNotAlphanumeric = /[^\p{L}\d-\s]/u

export const reDigits = /^\d+$/
export const reNotDigit = /\D/

export const reEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

export const reNumber = /^-?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/
export const reNumeric = /^[\d\.-\s]+$/
export const reNotNumeric = /[^\d\.-\s]/

export const reSentence = /^[\p{L}\d\s,.'-]*$/u
export const reNotSentence = /[^\p{L}\d\s,.'-]/u