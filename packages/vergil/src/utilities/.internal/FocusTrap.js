/** @type { (FocusTrap | undefined)[] } */
const stack = []
const setIsActive = Symbol('symSetIsActive')

export class FocusTrap {
	/** @type { number | undefined } */
	#idx
	#isActive = false;
	/** @param { boolean } value */
	[setIsActive](value) {
		this.#isActive = value
	}

	get isActive() {
		return this.#isActive
	}
	activate() {
		if (this.#isActive) return
		if (stack.length) (/** @type { FocusTrap } */ (stack.at(-1)))[setIsActive](false)
		this.#idx = stack.length - 1
		this.#isActive = true
		stack.push(this)
	}
	deactivate() {
		if (this.#idx === undefined) return
		if (stack.at(-1) === this) {
			do stack.pop()
			while (stack.length && !stack.at(-1))
			if (stack.length) (/** @type { FocusTrap } */ (stack.at(-1)))[setIsActive](true)
		} else {
			stack[this.#idx] = undefined
		}
		this.#idx = undefined
		this.#isActive = false
	}
}