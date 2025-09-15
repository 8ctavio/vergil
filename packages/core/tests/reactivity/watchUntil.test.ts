import { test, expect, vi, beforeEach } from 'vitest'
import { shallowRef } from 'vue'
import { watchUntil } from '#reactivity'
import { noop } from '#utilities'

/**
 * In order to detect that a mocked function's returned
 * promise has been resolved a .then handler is attached.
 * @see https://github.com/vitest-dev/vitest/blob/v4.0.0-beta.10/packages/spy/src/index.ts#L460
 */
const watchUntilSpy = vi.fn(watchUntil)
beforeEach(() => {
	watchUntilSpy.mockClear()
})

const fulfillOptions = [true, false, 8, 'vergil', null, {}, () => {}]

test("Resolve when condition is fulfilled", async () => {
	const src = shallowRef(false)
	queueMicrotask(() => {
		src.value = true
	})

	await watchUntilSpy(src, (v: unknown) => v)
	expect(watchUntilSpy).toHaveResolved()
})

test("Resolve with custom fulfill value", async () => {
	const src = shallowRef<any>()
	
	for (const fulfill of fulfillOptions) {
		src.value = undefined
		queueMicrotask(() => {
			src.value = fulfill
		})
	
		await watchUntilSpy(src, (v: unknown) => v, { fulfill })
		expect(watchUntilSpy).toHaveLastResolvedWith(fulfill)
	}
})

test("Resolve to value that fulfilled condition", async () => {
	for (const fulfill of fulfillOptions) {
		await expect(
			watchUntil(() => fulfill, () => true)
		).resolves.toBe(fulfill)
	}
})

test("Resolve to undefined after timeout", async () => {
	vi.useFakeTimers()

	const watchUntilPromise = watchUntilSpy(noop, noop, { timeout: 100 })
	vi.advanceTimersByTime(100)

	await watchUntilPromise
	expect(watchUntilSpy).toHaveResolvedWith(undefined)
})

test("Resolve before timeout", async () => {
	vi.useFakeTimers()
	const src = shallowRef(false)
	const watchUntilPromise = watchUntilSpy(src, () => src.value, { timeout: 100 })
	src.value = true
	vi.advanceTimersByTime(99)

	await watchUntilPromise
	expect(watchUntilSpy).not.toHaveResolvedWith(undefined)
})

test("Reject with AbortController signal", async () => {
	const controller = new AbortController()
	const watchUntilPromise = watchUntilSpy(noop, noop, { signal: controller.signal })
	controller.abort('reason')
	await expect(watchUntilPromise).rejects.toBe('reason')
})

test("Reject with aborted AbortController signal", async () => {
	const controller = new AbortController()
	controller.abort('reason')
	await expect(watchUntil(noop, noop, { signal: controller.signal })).rejects.toBe('reason')
})