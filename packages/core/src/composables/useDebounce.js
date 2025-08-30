import { toValue } from "vue"

/** 
 * @import { MaybeRefOrGetter } from 'vue'
 */

/**
 * Creates a debounced function.
 * 
 * @typedef { {
 *     (this: unknown, ...args: unknown[]): void;
 *     cancel: () => void;
 * } } Debounced
 * 
 * @param { Function } fn - Function to debounce. 
 * @param { MaybeRefOrGetter<number> } minWait - Time in milliseconds to wait before executing `fn` since the debounced function's last call.
 * @param { object } [options = {}]
 * @param { MaybeRefOrGetter<boolean> } [options.eager = false] - When set to `true`, `fn` is executed as soon as the debounced function is called *if* `fn` is not scheduled and `minWait` milliseconds have elapsed since `fn`'s last execution (or `fn` has not been executed). Defaults to `false`.
 * 
 * @returns { Debounced } Debounced function with `cancel` method to cancel scheduled `fn` execution.
 */
export function useDebounce(fn, minWait, options = {}) {
	const { eager = false } = options
	/** @type { number | undefined } */
	let delay
	/** @type { number | undefined } */
	let cooldown
	/** @type { (thisArg: unknown, args: unknown[]) => void } */
	const task = (thisArg, args) => {
		fn.apply(thisArg, args)
		clearTimeout(cooldown)
		cooldown = setTimeout(() => cooldown = undefined, toValue(minWait))
		delay = undefined
	}
	const debounced = /** @type { Debounced } */ (function(...args) {
		if (!toValue(eager) || delay || cooldown) {
			clearTimeout(delay)
			delay = setTimeout(task, toValue(minWait), this, args)
		} else {
			task(this, args)
		}
	})
	debounced.cancel = () => delay = void clearTimeout(delay)
	return debounced
}