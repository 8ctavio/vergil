import { suite, test, expect, vi } from "vitest"
import { shallowRef, triggerRef, nextTick, effectScope } from "vue"
import { watchControlled } from "#reactivity"

suite("Sync Watch", () => {
	const src = shallowRef()
	const options = { flush: 'sync' as const }
	
	test("Ignore paused-watcher source triggers", () => {
		const cb = vi.fn()
		const { pause, resume, ignore } = watchControlled(src, cb, options)
		
		pause()
		triggerRef(src)
		resume()
		expect(cb).not.toHaveBeenCalled()

		ignore(() => {
			triggerRef(src)
		})
		expect(cb).not.toHaveBeenCalled()

		triggerRef(src)
		expect(cb).toHaveBeenCalledOnce()
	})

	test("Stop watcher programatically", () => {
		const cb = vi.fn()
		const { stop } = watchControlled(src, cb, options)
		
		triggerRef(src)
		expect(cb).toHaveBeenCalledOnce()

		stop()
		triggerRef(src)
		expect(cb).toHaveBeenCalledOnce()
	})

	test("Stop watcher by stopping effect scope", () => {
		const cb = vi.fn()
		const scope = effectScope()
		scope.run(() => {
			watchControlled(src, cb, options)
		})
		
		triggerRef(src)
		expect(cb).toHaveBeenCalledOnce()

		scope.stop()
		triggerRef(src)
		expect(cb).toHaveBeenCalledOnce()
	})
})

suite("Non-Sync Watch", () => {
	const src = shallowRef()
	
	test("Ignore paused-watcher source triggers", async () => {
		const cb = vi.fn()
		const { pause, resume, ignore } = watchControlled(src, cb)
		
		pause()
		triggerRef(src)
		resume()
		await nextTick()
		expect(cb).not.toHaveBeenCalled()

		ignore(() => {
			triggerRef(src)
		})
		await nextTick()
		expect(cb).not.toHaveBeenCalled()

		triggerRef(src)
		pause()
		triggerRef(src)
		resume()
		await nextTick()
		expect(cb).toHaveBeenCalledTimes(1)

		pause()
		triggerRef(src)
		resume()
		triggerRef(src)
		await nextTick()
		expect(cb).toHaveBeenCalledTimes(2)
	})

	test("Skip paused-watcher scheduled callbacks", async () => {
		const cb = vi.fn()
		const { pause, resume } = watchControlled(src, cb)
		
		triggerRef(src)
		pause()
		await nextTick()
		resume()
		expect(cb).not.toHaveBeenCalled()
	})

	test("Stop effects programatically", async () => {
		let stop: () => void
		const cb = vi.fn()
		const scope = effectScope()
		scope.run(() => {
			stop = watchControlled(src, cb).stop
		})
		
		// @ts-expect-error
		expect(scope.effects.length).toBeGreaterThan(0)

		triggerRef(src)
		await nextTick()
		expect(cb).toHaveBeenCalledOnce()

		stop!()
		triggerRef(src)
		await nextTick()
		expect(cb).toHaveBeenCalledOnce()
		
		// @ts-expect-error
		expect(scope.effects.length).toBe(0)
	})

	test("Stop watchers by stopping effect scope", async () => {
		const cb = vi.fn()
		const scope = effectScope()
		scope.run(() => {
			watchControlled(src, cb)
		})
		
		// @ts-expect-error
		expect(scope.effects.length).toBeGreaterThan(0)

		triggerRef(src)
		await nextTick()
		expect(cb).toHaveBeenCalledOnce()

		scope.stop()
		triggerRef(src)
		await nextTick()
		expect(cb).toHaveBeenCalledOnce()
		
		// @ts-expect-error
		expect(scope.effects.length).toBe(0)
	})
})