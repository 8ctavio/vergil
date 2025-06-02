import { vi, test, expect } from 'vitest'
import { debounce } from '../../utilities'

test('Debounced function', async () => {
	const spy = vi.fn()
	const debounced = debounce(spy, 0)

	for (let i=0; i<10; i++) debounced()
	
	expect(spy).toHaveBeenCalledTimes(0)
	await new Promise(resolve => {
		setTimeout(resolve, 0)
	})
	expect(spy).toHaveBeenCalledTimes(1)
})

test('Eager debounced function', async () => {
	const spy = vi.fn()
	const debounced = debounce(spy, 0, { eager: true })

	for (let i=0; i<10; i++) debounced()

	expect(spy).toHaveBeenCalledTimes(1)
	await new Promise(resolve => {
		setTimeout(resolve, 0)
	})
	expect(spy).toHaveBeenCalledTimes(2)
})

test('Cancel scheduled execution of debounced function', async () => {
	for (const eager of [false, true]) {
		const spy = vi.fn()
		const debounced = debounce(spy, 0, { eager })

		for (let i=0; i<10; i++) debounced()
		
		expect(spy).toHaveBeenCalledTimes(eager ? 1 : 0)
		
		debounced.cancel()

		await new Promise(resolve => {
			setTimeout(resolve, 0)
		})
		expect(spy).toHaveBeenCalledTimes(eager ? 1 : 0)
	}
})