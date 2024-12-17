<script setup>
import InputText from './InputText.vue'
import { shallowRef, watchEffect } from 'vue'
import { useModel, isModel } from '../../composables'
import { separateThousands } from '../../utilities'

const props = defineProps({
	value: {
		type: [Number, String],
		default: 0
	},
	modelValue: {
		default: props => useModel(props.value),
		validator: isModel
	},
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
	disabled: Boolean,
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
const model = useModel(props.modelValue)
const displayedString = useModel('')
let displayedNumber = 0
model.watchers.onUpdated(modelValue => {
	const modelNumber = Number(modelValue)
	if(Number.isNaN(modelNumber)) {
		model.watchers.ignore(() => {
			if(range.min > 0) {
				model.value = range.min
			} else if(range.max < 0) {
				model.value = range.max
			} else {
				model.value = Math.min(-range.min, range.max)
			}
		})
	} else if(modelNumber < range.min) {
		model.watchers.ignore(() => {
			model.value = range.min
		})
	} else if(modelNumber > range.max) {
		model.watchers.ignore(() => {
			model.value = range.max
		})
	} else if(typeof modelValue !== 'number') {
		model.watchers.ignore(() => {
			model.value = modelNumber
		})
	}
	formatDisplayedString()
}, { immediate: true })

function formatDisplayedString() {
	const displayedValue = model.value.toFixed(Math.min(Math.max(countFractionalDigits(model.value), fraction.minDigits), fraction.maxDigits))
	displayedString.value = props.separator ? separateThousands(displayedValue) : displayedValue
	displayedNumber = model.value
}

//----------------------------------------------------
//---------- INPUT & CHANGE EVENTS HANDLERS ----------
//----------------------------------------------------
const eventData = {
	valueString: '',
	valueNumber: 0,
	radixAction: '',
}
function handleBeforeInput(event) {
	const { data, inputType, target } = event

	// Unimplemented
	if(['historyUndo','historyRedo'].includes(inputType))
		return event.preventDefault()

	let newValue
	if(data) {
		if(!RegExp(`^${range.min < 0 ?'-?':''}\\d*${fraction.enabled ?'\\.?\\d*':''}$`).test(data))
			return event.preventDefault()

		if(target.value[0] === '-' && target.selectionStart === 0 && target.selectionEnd === 0)
			target.selectionStart++

		if (data[0] === '-' && target.selectionStart > 0)
			return event.preventDefault()

		if(fraction.enabled) {
			const radixIDX = target.value.indexOf('.')
			if(data.includes('.')) {
				if(radixIDX === -1) {
					eventData.radixAction = 'insert'
				} else if (radixIDX < target.selectionStart || radixIDX >= target.selectionEnd) {
					if(data === '.' && [target.selectionStart,target.selectionEnd].every(v => v === radixIDX)) {
						target.selectionStart++
					}
					return event.preventDefault()
				}
			} else if(radixIDX >= target.selectionStart && radixIDX < target.selectionEnd) {
				eventData.radixAction = 'remove'
			}
		}

		newValue = target.value.slice(0,target.selectionStart) + data + target.value.slice(target.selectionEnd)
	} else if(inputType.startsWith('delete')) {
		const deleteSelection = getDeleteSelection(inputType, target)

		const radixIDX = target.value.indexOf('.', deleteSelection.start)
		if(radixIDX > -1 && radixIDX < deleteSelection.end) {
			eventData.radixAction = 'remove'
		}

		// Move cursor when trying to delete a single separator
		if(deleteSelection.size === 1 && target.value[deleteSelection.start] === ',') {
			if(deleteSelection.collapsed) {
				if(deleteSelection.direction === 'backward') {
					target.selectionEnd--
					deleteSelection.start--
					deleteSelection.end--
				} else {
					target.selectionStart++
					deleteSelection.start++
					deleteSelection.end++
				}
			} else return event.preventDefault()
		}

		newValue = target.value.slice(0,deleteSelection.start) + target.value.slice(deleteSelection.end)
	} else if(inputType.startsWith('insert')) {
		return event.preventDefault()
	}

	if(props.separator) newValue = newValue.replaceAll(',','')
	if(countFractionalDigits(newValue) > fraction.maxDigits)
		return event.preventDefault()

	eventData.valueString = newValue
	eventData.valueNumber = Number(/\d/.test(newValue) ? newValue : 0)
}
function handleInput(event) {
	const { target } = event
	
	let cursorOffset = target.value.length - target.selectionEnd - Number(target.value[0] === ',')

	if(props.separator) {
		// Adjust cursor position since inserting/deleting a radix deletes/inserts thousands separators
		if(eventData.radixAction === 'insert') {
			cursorOffset -= Math.trunc(cursorOffset / 4)
		} else if(eventData.radixAction === 'remove') {
			cursorOffset += Math.trunc((cursorOffset - Number(target.selectionEnd === 0)) / 3)
		}
		eventData.radixAction = ''
		target.value = separateThousands(eventData.valueString)
	} else {
		target.value = eventData.valueString
	}

	const cursorPosition = target.value.length - cursorOffset
	target.setSelectionRange(cursorPosition, cursorPosition)

	model.watchers.pause()
	if(eventData.valueNumber < range.min) {
		model.value = range.min
	} else if(eventData.valueNumber > range.max) {
		model.value = range.max
	} else {
		model.value = eventData.valueNumber
	}
	model.watchers.resume()

	displayedString.value = target.value
	displayedNumber = eventData.valueNumber

	// Note: target.value[0] === ',' and target.selectionEnd === 0 can only be true if part of the string's start is deleted
}
function handleChange(event) {
	if(displayedNumber < range.min || displayedNumber > range.max) {
		formatDisplayedString()
	} else if(model.value === 0) {
		displayedString.value = '0' + (fraction.minDigits > 0 ? '.' + '0'.repeat(fraction.minDigits) : '')
	} else {
		const { value } = event.target
		
		const minus = value[0] === '-' ? '-' : ''
		let radixIDX = -1
		let numStart = minus.length
		let numEnd
		let leadingZero = ''
		let trailingZeros = ''
		
		const res = /[1-9\.]/.exec(value)
		if(res) {
			if(res[0] === '.') {
				radixIDX = res.index
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
				numStart = res.index
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
			displayedString.value = minus + leadingZero + value.slice(numStart, numEnd) + trailingZeros
		} else if(leadingZero || trailingZeros) {
			displayedString.value = leadingZero + value + trailingZeros
		}
	}
}

//------------------------------
//---------- STEPPERS ----------
//------------------------------
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
function stepUp() {
	const result = sum(model.value, props.step, fraction.maxDigits)
	if(result <= range.max) {
		model.watchers.ignore(() => {
			model.value = result
		})
		formatDisplayedString()
	}
}
function stepDown() {
	const result = sum(model.value, -props.step, fraction.maxDigits)
	if(result >= range.min) {
		model.watchers.ignore(() => {
			model.value = result
		})
		formatDisplayedString()
	}
}
function handleKeydown(event) {
	const { key } = event
	if(key === 'ArrowUp') {
		event.preventDefault()
		stepUp()
	} else if(key === 'ArrowDown') {
		event.preventDefault()
		stepDown()
	} else if(key === 'Enter') {
		handleChange(event)
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
	<InputText
		class="input-number"
        :model-value="displayedString"
        :btnBefore
        :btnAfter
		@beforeinput="handleBeforeInput"
		@input="handleInput"
		@change="handleChange"
        @keydown="handleKeydown"
	/>
</template>

<script>
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

function countFractionalDigits(num, radixIDX) {
	num = num.toString()
	radixIDX ??= num.indexOf('.')
	return radixIDX > -1 ? (num.length - radixIDX - 1) : 0
}
</script>