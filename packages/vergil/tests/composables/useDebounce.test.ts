import { vi, test, expect } from 'vitest'
import { shallowRef } from 'vue'
import { useDebounce } from '#composables'

function callMultipleTimes(fn: Function) {
	for (let i=0; i<10; i++) fn()
}
function queueTask(fn: Function) {
	setTimeout(fn, 0)
}
function taskQueueTick() {
	return new Promise(resolve => {
		setTimeout(resolve, 0)
	})
}

test('Debounced function', () => {
	const spy = vi.fn()
	const debounced = useDebounce(spy, 0)

	callMultipleTimes(debounced)
	
	expect(spy).toHaveBeenCalledTimes(0)
	queueTask(() => {
		expect(spy).toHaveBeenCalledTimes(1)
	})
})

test('Eager debounced function', () => {
	const spy = vi.fn()
	const debounced = useDebounce(spy, 0, { eager: true })

	callMultipleTimes(debounced)

	expect(spy).toHaveBeenCalledTimes(1)
	queueTask(() => {
		expect(spy).toHaveBeenCalledTimes(2)
	})
})

test("Toggle eagerness", async () => {
	const spy = vi.fn()
	const eager = shallowRef(false)
	const debounced = useDebounce(spy, 0, { eager })

	callMultipleTimes(debounced)

	expect(spy).toHaveBeenCalledTimes(0)
	await taskQueueTick()
	expect(spy).toHaveBeenCalledTimes(1)
	await taskQueueTick()

	eager.value = true
	callMultipleTimes(debounced)

	expect(spy).toHaveBeenCalledTimes(2)
	await taskQueueTick()
	expect(spy).toHaveBeenCalledTimes(3)
})

test("Cannot force execution by changing eagerness", () => {
	const spy = vi.fn()
	const eager = shallowRef(false)
	const debounced = useDebounce(spy, 0, { eager })

	callMultipleTimes(debounced)
	expect(spy).toHaveBeenCalledTimes(0)

	eager.value = true
	
	callMultipleTimes(debounced)
	expect(spy).toHaveBeenCalledTimes(0)
})

test('Cancel scheduled execution of debounced function', async () => {
	for (const eager of [false, true]) {
		const spy = vi.fn()
		const debounced = useDebounce(spy, 0, { eager })

		callMultipleTimes(debounced)
		expect(spy).toHaveBeenCalledTimes(eager ? 1 : 0)
		
		debounced.cancel()
		await taskQueueTick()

		expect(spy).toHaveBeenCalledTimes(eager ? 1 : 0)
	}
})

test('Time waited before executing debounced function', async () => {
	vi.useFakeTimers()
	for (const eager of [false, true]) {
		const spy = vi.fn()
		const debounced = useDebounce(spy, 100, { eager })

		for (let i=0; i<10; i++) debounced()
		
		vi.advanceTimersByTime(99)
		expect(spy).toHaveBeenCalledTimes(eager ? 1 : 0)
		
		vi.advanceTimersByTime(1)
		expect(spy).toHaveBeenCalledTimes(eager ? 2 : 1)
	}
	vi.useRealTimers()
})

test("Update delay duration", async () => {
	vi.useFakeTimers()

	const spy = vi.fn()
	const minWait = shallowRef(100)
	const debounced = useDebounce(spy, minWait)

	callMultipleTimes(debounced)
	
	vi.advanceTimersByTime(99)
	expect(spy).toHaveBeenCalledTimes(0)

	minWait.value = 200
	callMultipleTimes(debounced)

	vi.advanceTimersByTime(100)
	expect(spy).toHaveBeenCalledTimes(0)
	
	vi.advanceTimersByTime(100)
	expect(spy).toHaveBeenCalledTimes(1)
	
	vi.useRealTimers()
})