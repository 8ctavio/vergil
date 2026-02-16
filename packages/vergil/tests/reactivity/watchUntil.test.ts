import { suite, test, expect, vi, beforeEach } from 'vitest'
import { shallowRef, nextTick } from 'vue'
import { watchUntil } from '#reactivity'
import { noop, getTrue } from '#utilities'
import type { Mock } from 'vitest'

/**
 * In order to detect that a mocked function's returned
 * promise has been resolved a .then handler is attached.
 * @see https://github.com/vitest-dev/vitest/blob/v4.0.18/packages/spy/src/index.ts#L491
 */
const watchUntilSpy = vi.fn(watchUntil) as Mock<typeof watchUntil> & typeof watchUntil
beforeEach(() => {
	watchUntilSpy.mockClear()
})

const fulfillOptions = [true, false, 8, 'vergil', null, {}, () => {}]

test("Resolve when condition is fulfilled", async () => {
	const src = shallowRef(false)
	queueMicrotask(() => {
		src.value = true
	})

	await watchUntilSpy(src, v => v)
	expect(watchUntilSpy).toHaveResolved()
})

test("Resolve if condition is initially fulfilled", async () => {
	await watchUntilSpy(noop, getTrue)
	expect(watchUntilSpy).toHaveResolved()
})

test("Resolve with custom fulfill value", async () => {
	const src = shallowRef<any>()
	
	for (const fulfill of fulfillOptions) {
		src.value = undefined
		queueMicrotask(() => {
			src.value = fulfill
		})
	
		await watchUntilSpy(src, v => v, { fulfill })
		expect(watchUntilSpy).toHaveLastResolvedWith(fulfill)
	}
})

test("Resolve to value that fulfilled condition", async () => {
	for (const fulfill of fulfillOptions) {
		await expect(
			watchUntil(() => fulfill, getTrue)
		).resolves.toBe(fulfill)
	}
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

test("Reject after timeout", async () => {
	vi.useFakeTimers()

	const watchUntilPromise = watchUntilSpy(noop, noop, { signal: AbortSignal.timeout(100) })
	vi.advanceTimersByTime(100)
	await expect(watchUntilPromise).rejects.toBeInstanceOf(DOMException)

	vi.useRealTimers()
})

test("Resolve before timeout", async () => {
	vi.useFakeTimers()

	const src = shallowRef(false)
	const watchUntilPromise = watchUntilSpy(src, () => src.value, { signal: AbortSignal.timeout(100) })
	src.value = true
	vi.advanceTimersByTime(99)

	await watchUntilPromise
	expect(watchUntilSpy).toHaveResolved()

	vi.useRealTimers()
})

suite("Watcher cleanup", () => {
	test("Stop watching source after condition is fulfilled", async () => {
		const src = shallowRef(0)
		const spy = vi.fn(v => v > 0)
		watchUntilSpy(src, spy)
		expect(spy).toHaveBeenCalledTimes(1)

		src.value++
		await nextTick()
		expect(spy).toHaveBeenCalledTimes(2)
		expect(watchUntilSpy).toHaveResolved()
		
		spy.mockClear()
		src.value++
		await nextTick()
		expect(spy).not.toHaveBeenCalled()
	})

	test("Stop watching source if condition is initially fulfilled", async () => {
		const src = shallowRef(false)
		const spy = vi.fn(getTrue)

		await watchUntilSpy(src, spy)
		expect(watchUntilSpy).toHaveResolved()

		expect(spy).toHaveBeenCalledOnce()
		src.value = true
		await nextTick()
		expect(spy).toHaveBeenCalledOnce()
	})

	test("Stop watching source if operation is aborted", async () => {
		const src = shallowRef(0)
		const spy = vi.fn(noop)
		const controller = new AbortController()

		const watchUntilPromise = watchUntilSpy(src, spy, { signal: controller.signal })

		expect(spy).toHaveBeenCalledTimes(1)
		src.value++
		await nextTick()
		expect(spy).toHaveBeenCalledTimes(2)
		expect(watchUntilSpy).not.toHaveResolved()

		controller.abort('reason')
		await expect(watchUntilPromise).rejects.toBe('reason')

		spy.mockClear()
		src.value++
		await nextTick()
		expect(spy).not.toHaveBeenCalled()
	})

	test("Stop watching source after timeout", async () => {
		vi.useFakeTimers()
		const src = shallowRef(0)
		const spy = vi.fn(noop)

		const watchUntilPromise = watchUntilSpy(src, spy, { signal: AbortSignal.timeout(100) })

		expect(spy).toHaveBeenCalledTimes(1)
		src.value++
		await nextTick()
		expect(spy).toHaveBeenCalledTimes(2)
		expect(watchUntilSpy).not.toHaveResolved()

		vi.advanceTimersByTime(100)
		await expect(watchUntilPromise).rejects.toBeInstanceOf(DOMException)

		spy.mockClear()
		src.value++
		await nextTick()
		expect(spy).not.toHaveBeenCalled()
		
		vi.useRealTimers()
	})
})