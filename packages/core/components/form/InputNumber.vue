<script setup>
import InputTextBase from '../private/InputTextBase.vue'
import { shallowRef, watchEffect, provide } from 'vue'
import { vergil } from '../../vergil'
import { useDefineModel, useDefineElements } from '../../composables'
import { separateThousands } from '../../utilities'
import { clamp } from '../../utilities/private'

const props = defineProps({
	//----- Model -----
	value: {
		type: [Number, String],
		default: 0
	},
	modelValue: {
		type: [Number, String, Object],
		default: props => props.value
	},
    ['onUpdate:modelValue']: Function,
	validator: Function,
	eagerValidation: Boolean,
    elements: Object,

	min: {
		type: Number,
		default: -Infinity
	},
	max: {
		type: Number,
		default: Infinity,
		validator: (max, { min }) => min ? (max > min) : true
	},
	fraction: {
		type: [Boolean, Number, Array],
		default: true,
		validator(v) {
			if(Array.isArray(v)) {
				const [min,max] = v
				return !(max && max < min) && v.every(n => Number.isInteger(n) && n >= 0)
			}
			return typeof v === 'boolean' || (Number.isInteger(v) && v >= 0)
		}
	},
	separator: {
		type: Boolean,
		default: true
	},
	step: {
		type: Number,
		default: 1,
		validator: v => v > 0
	},
	steppers: Boolean,
	btnBefore: Object,
    btnAfter: Object,

	//----- Debounced validation -----
    preventEnterValidation: Boolean,
	validationDelay: {
		type: Number,
		default: () => vergil.config.inputNumber.validationDelay ?? vergil.config.global.validationDelay,
	},
	validationCooldown: {
		type: Number,
		default: () => vergil.config.inputNumber.validationCooldown ?? vergil.config.global.validationCooldown,
	},
})

//---------- Value & Fractional Digits Ranges ----------
const range = {}
const fraction = {}
watchEffect(() => {
	fraction.minDigits = fraction.maxDigits = 0
	if(typeof props.fraction === 'boolean') {
		if(props.fraction) fraction.maxDigits = Infinity
	} else if(typeof props.fraction === 'number') {
		fraction.minDigits = fraction.maxDigits = props.fraction
	} else if(Array.isArray(props.fraction)) {
		[fraction.minDigits, fraction.maxDigits = props.fraction[0]] = props.fraction
	}
	fraction.enabled = fraction.maxDigits > 0
	if(fraction.enabled) {
		range.min = props.min
		range.max = props.max
	} else {
		range.min = Math.ceil(props.min)
		range.max = Math.floor(props.max)
	}
})

//---------------------------
//---------- MODEL ----------
//---------------------------
let displayedNumber = 0
const model = useDefineModel()
const elements = useDefineElements(['input'])
const validateWithDelay = model.useDebouncedValidation(props.validationDelay)
const validateWithCooldown = model.useDebouncedValidation(props.validationCooldown, { eager: true })

provide('model', model)
provide('elements', elements)

model.onExternalUpdate(modelValue => {
	const modelNumber = Number(modelValue)
	if(Number.isNaN(modelNumber)) {
		model.update(() => {
			if(range.min > 0) {
				model.value = range.min
			} else if(range.max < 0) {
				model.value = range.max
			} else {
				model.value = Math.min(-range.min, range.max)
			}
		})
	} else if(modelNumber < range.min) {
		model.update(range.min)
	} else if(modelNumber > range.max) {
		model.update(range.max)
	} else if(typeof modelValue !== 'number') {
		model.update(modelNumber)
	}
	formatDisplayedString()
}, { onMounted: true })

function formatDisplayedString() {
	const displayedValue = model.value.toFixed(clamp(countFractionalDigits(model.value), fraction.minDigits, fraction.maxDigits))
	elements.input.value = props.separator ? separateThousands(displayedValue) : displayedValue
	displayedNumber = model.value
}

//----------------------------------------------------
//---------- INPUT & CHANGE EVENTS HANDLERS ----------
//----------------------------------------------------
const eventData = {
	newString: '',
	newNumber: 0,
	cursorPosition: 0
}
function handleBeforeInput(event) {
	const { data, inputType, target } = event

	// Unimplemented
	if(['historyUndo','historyRedo'].includes(inputType))
		return event.preventDefault()

	let newValue
	let cursorOffset
	let radixDeleted = false
	let startDeleted = false
	if(data) {
		if(!reValidNumber.test(data))
			return event.preventDefault()

		if(target.value[0] === '-' && target.selectionStart === 0 && target.selectionEnd === 0)
			target.selectionStart++

		cursorOffset = target.value.length - target.selectionEnd
		let dataStart = 0
		let dataEnd
		let trailingDigits
		let trailingEnd

		if(data[0] === '-' && (range.min >= 0 || target.selectionStart > 0)) {
			if(data.length > 1) {
				dataStart = 1
			} else {
				return event.preventDefault()
			}
		}

		const dataRadix = data.indexOf('.')
		if(fraction.enabled) {
			const valueRadix = target.value.indexOf('.')
			if(dataRadix > -1) {
				if(valueRadix > -1 && (valueRadix < target.selectionStart || valueRadix >= target.selectionEnd)) {
					if(data.length === 1 && valueRadix === target.selectionStart) {
						target.selectionStart++
					}
					return event.preventDefault()
				} else {
					// Inserting a radix deletes thousands separators
					if(valueRadix === -1 && props.separator) {
						cursorOffset -= Math.trunc(cursorOffset / 4)
					}
					const dataFracDigits = countFractionalDigits(data, dataRadix)
					if(dataFracDigits < fraction.maxDigits) {
						const remainingFracDigits = fraction.maxDigits - dataFracDigits
						if(cursorOffset > remainingFracDigits) {
							cursorOffset = remainingFracDigits
							if(props.separator) {
								trailingDigits = ''
								for(let i=target.selectionEnd; trailingDigits.length < remainingFracDigits; i++) {
									const digit = target.value[i]
									if(digit !== ',') trailingDigits += digit
								}
							} else {
								trailingEnd = target.selectionEnd + remainingFracDigits
							}
						}
					} else {
						cursorOffset = 0
						trailingDigits = ''
						dataEnd = dataRadix + fraction.maxDigits + 1
					}
				}
			} else if(valueRadix > -1) {
				if(valueRadix < target.selectionStart) {
					const fracDigitsBeforeSelectionStart = target.selectionStart - valueRadix - 1
					const fracDigitsBeforeSelectionEnd = fracDigitsBeforeSelectionStart + data.length - dataStart
					if(fracDigitsBeforeSelectionEnd < fraction.maxDigits) {
						const remainingFracDigits = fraction.maxDigits - fracDigitsBeforeSelectionEnd
						if(cursorOffset > remainingFracDigits) {
							cursorOffset = remainingFracDigits
							trailingEnd = target.selectionEnd + remainingFracDigits
						}
					} else {
						cursorOffset = 0
						trailingDigits = ''
						dataEnd = fraction.maxDigits - fracDigitsBeforeSelectionStart
					}
				} else if(valueRadix < target.selectionEnd) {
					radixDeleted = true
				}
			}
		} else if(dataRadix > -1) {
			dataEnd = dataRadix
		}
		
		newValue = target.value.slice(0, target.selectionStart).concat(
			(dataStart > 0 || dataEnd !== undefined) ? data.slice(dataStart,dataEnd) : data,
			trailingDigits ?? target.value.slice(target.selectionEnd, trailingEnd)
		)
	} else if(inputType.startsWith('delete')) {
		const deleteSelection = getDeleteSelection(inputType, target)

		if(deleteSelection.start === 0) {
			startDeleted = true
			if(target.value[0] === '-' && range.max < 0) {
				target.selectionStart = target.selectionEnd = 1
				if(deleteSelection.size === 1) {
					return event.preventDefault()
				} else {
					deleteSelection.start++
				}
			}
		}

		if(deleteSelection.size === 1) {
			const deleted = target.value[deleteSelection.start]
			if(deleted === ',') {
				if(deleteSelection.direction === 'backward') {
					target.selectionEnd--
				} else {
					target.selectionStart++
				}
				
				if(deleteSelection.collapsed) {
					deleteSelection.start += deleteSelection.direction === 'backward' ? -1 : 1
					deleteSelection.end = deleteSelection.start + 1
				} else {
					return event.preventDefault()
				}
			} else if(deleted === '.') {
				radixDeleted = true
			}
		} else {
			const radixIDX = target.value.indexOf('.', deleteSelection.start)
			if(radixIDX > -1 && radixIDX < deleteSelection.end) {
				radixDeleted = true
			}
		}

		cursorOffset = target.value.length - deleteSelection.end
		if(target.value[deleteSelection.end] === ',' && (deleteSelection.start === 0 || target.value[deleteSelection.start - 1] === '-')) {
			// A separator after the delete selectionn will be removed if before the selection there is not a digit
			cursorOffset--
		}

		newValue = target.value.slice(0,deleteSelection.start) + target.value.slice(deleteSelection.end)
	} else if(inputType.startsWith('insert')) {
		if(inputType !== 'insertLineBreak') {
			event.preventDefault()
		}
		return
	}

	if(props.separator) {
		// Removing a radix inserts thousands separators
		if(radixDeleted) {
			cursorOffset += Math.trunc((cursorOffset - Number(startDeleted)) / 3)
		}
		newValue = newValue.replaceAll(',','')
		eventData.newString = separateThousands(newValue)
	} else {
		eventData.newString = newValue
	}
	eventData.newNumber = Number(/\d/.test(newValue) ? newValue : 0)
	eventData.cursorPosition = eventData.newString.length - cursorOffset
}
function handleInput(event) {
	const { target } = event
	target.value = eventData.newString
	target.setSelectionRange(eventData.cursorPosition, eventData.cursorPosition)

	model.update(clamp(eventData.newNumber, range.min, range.max))
	elements.input.value = eventData.newString
	displayedNumber = eventData.newNumber
	validateWithDelay(props.eagerValidation)

	eventData.newString = ''
	eventData.newNumber = 0
	eventData.cursorPosition = 0
}
function handleChange(event) {
	if(displayedNumber < range.min || displayedNumber > range.max) {
		formatDisplayedString()
	} else if(model.value === 0) {
		elements.input.value = '0' + (fraction.minDigits > 0 ? '.' + '0'.repeat(fraction.minDigits) : '')
	} else {
		const { value } = event.target
		
		const minus = value[0] === '-' ? '-' : ''
		let radixIDX = -1
		let numStart = minus.length
		let numEnd
		let leadingZero = ''
		let trailingZeros = ''
		
		const idx = value.search(/[1-9\.]/)
		if(idx > -1) {
			if(value[idx] === '.') {
				radixIDX = idx
				if(radixIDX === minus.length) {
					leadingZero = '0'
					if(minus) {
						numStart = radixIDX + 1
						leadingZero += '.'
					}
				} else {
					numStart = radixIDX - 1
				}
			} else {
				numStart = idx
				radixIDX = value.indexOf('.', numStart + 1)
			}
		}

		if(radixIDX > -1) {
			const fractionalDigits = value.length - radixIDX - 1
			if(fractionalDigits === 0 && fraction.minDigits === 0) {
				numEnd = radixIDX
			} else if(fractionalDigits < fraction.minDigits) {
				trailingZeros = '0'.repeat(fraction.minDigits - fractionalDigits)
			}
		} else if(fraction.minDigits > 0) {
			trailingZeros = '.' + '0'.repeat(fraction.minDigits)
		}

		if(numStart > minus.length || numEnd) {
			elements.input.value = minus + leadingZero + value.slice(numStart, numEnd) + trailingZeros
		} else if(leadingZero || trailingZeros) {
			elements.input.value = leadingZero + value + trailingZeros
		}
	}
}

//------------------------------
//---------- STEPPERS ----------
//------------------------------
function stepUp(lazyValidation = false) {
	const result = sum(model.value, props.step, fraction.maxDigits)
	if(result <= range.max) {
		model.update(result)
		formatDisplayedString()
		(lazyValidation ? validateWithDelay : validateWithCooldown)(props.eagerValidation)
	}
}
function stepDown(lazyValidation = false) {
	const result = sum(model.value, -props.step, fraction.maxDigits)
	if(result >= range.min) {
		model.update(result)
		formatDisplayedString()
		(lazyValidation ? validateWithDelay : validateWithCooldown)(props.eagerValidation)
	}
}
function handleKeydown(event) {
	const { key } = event
	if(key === 'ArrowUp') {
		event.preventDefault()
		stepUp(true)
	} else if(key === 'ArrowDown') {
		event.preventDefault()
		stepDown(true)
	} else if(key === 'Enter') {
		handleChange(event)
		if (!(event.target.form || props.preventEnterValidation)) {
			validateWithCooldown(props.eagerValidation)
		}
	}
}

const btnBefore = shallowRef({})
const btnAfter = shallowRef({})
watchEffect(() => {
	if(props.steppers) {
		btnBefore.value = {
			iconRight: 'remove',
			onClick: stepDown,
			variant: 'subtle',
			outline: 'subtle',
			...props.btnBefore
		}
		btnAfter.value = {
			iconLeft: 'add',
			onClick: stepUp,
			variant: 'subtle',
			outline: 'subtle',
			...props.btnAfter
		}
	} else {
		btnBefore.value = props.btnBefore
		btnAfter.value = props.btnAfter
	}
})
</script>

<template>
	<InputTextBase
		class="input-number"
        :btnBefore
        :btnAfter
		@beforeinput="handleBeforeInput"
		@input="handleInput"
		@change="handleChange"
        @keydown="handleKeydown"
	/>
</template>

<script>
const reValidNumber = /^-?\d*\.?\d*$/

function countFractionalDigits(num, radixIDX) {
	num = num.toString()
	radixIDX ??= num.indexOf('.')
	return radixIDX > -1 ? (num.length - radixIDX - 1) : 0
}
function sum(a, b, fractionalDigits) {
	if(!Number.isInteger(a) || !Number.isInteger(b)) {
		const shift = 10 ** (Number.isFinite(fractionalDigits)
			? fractionalDigits
			: Math.max(countFractionalDigits(a), countFractionalDigits(b)) 
		)
		return (Math.round(a * shift) + Math.round(b * shift)) / shift
	} else {
		const r = a + b
		return Number.isSafeInteger(r) ? r : (Math.sign(r)*Number.MAX_SAFE_INTEGER)
	}
}

/*
	Possible inputType values:
	
	deleteContentBackward
		- Trigger:
			- windows: backspace
		- Behavior:
			- Collapsed: Deletes character before caret position.
			- Non-collapsed: Deletes selection

	deleteContentForward
		- Trigger:
			- windows: delete
		- Behavior:
			- Collapsed: Deletes character after caret position.
			- Non-collapsed: Deletes selection

	deleteByCut
		- Behavior:
			- Non-collapsed only: Similar to "deleteContent" with non-collapsed selection

	deleteByDrag
		- Behavior:
			- Non-collapsed only: Similar to "deleteContent" with non-collapsed selection

	deleteWordBackward
		- Trigger:
			- windows: ctrl + backspace
		- Behavior:
			- Collapsed: Deletes word before caret position.
			- Non-collapsed: Deletes selection

	deleteWordForward
		- Trigger:
			- windows: ctrl + delete
		- Behavior:
			- Collapsed: Deletes word after caret position.
			- Non-collapsed: Deletes selection

	deleteSoftLineBackward
		- Behavior: Similar to "deleteWordBackward" but only for macOS

	deleteSoftLineForward
		- Behavior: Similar to "deleteWordForward" but only for macOS

	other values
		["deleteEntireSoftLine", "deleteHardLineBackward", "deleteHardLineForward", "deleteContent"]
*/
function getDeleteSelection(inputType, target) {
	const { selectionStart, selectionEnd, value } = target
	const selection = {
		start: 0,
		end: 0,
		size: 0,
		collapsed: selectionStart === selectionEnd,
		direction: inputType.endsWith('Forward') ? 'forward' : 'backward'
	}
	if(selection.collapsed) {
		switch(inputType){
            case 'deleteContentBackward':
            case 'deleteByCut':
            case 'deleteByDrag':
            case 'deleteContent':
                selection.start = selectionStart - 1
                selection.end = selectionEnd
                break
            case 'deleteWordBackward':
            case 'deleteSoftLineBackward':
            case 'deleteHardLineBackward':
                selection.start = 0
                selection.end = selectionEnd
                break
            case 'deleteContentForward':
                selection.start = selectionStart
                selection.end = selectionEnd + 1
                break
            case 'deleteWordForward':
            case 'deleteSoftLineForward':
            case 'deleteHardLineForward':
                selection.start = selectionStart
                selection.end = value.length
                break
            case 'deleteEntireSoftLine':
                selection.start = 0
                selection.end = value.length
        }
	} else {
		selection.start = selectionStart
        selection.end = selectionEnd
	}
	selection.size = selection.end - selection.start
    return selection
}
</script>