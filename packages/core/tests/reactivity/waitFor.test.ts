import { suite, test, expect, vi, } from "vitest"
import { shallowRef, toValue, nextTick, triggerRef } from "vue"
import { waitFor } from "#reactivity"
import { noop, getTrue } from "#utilities"
import type { MaybeRef, ShallowRef } from "vue"

const conditions = {
	base: ['toFulfill'],
	initial: ['toChange', 'not'],
	monosource: [
		'toBe',
		'toEqual',
		'toBeIn',
		'toBeTruthy',
		'toContain'
	],
	multisource: ['toBeEqual']
}

suite("Generate methods", () => {
	test("Generate monosource methods", () => {
		const methods = waitFor(noop)
		for (const m of [conditions.base, conditions.initial, conditions.monosource]) {
			for (const method of m) {
				expect(method).toSatisfy(m => m in methods)
			}
		}
	})

	test("Generate multisource methods", () => {
		const methods = waitFor([noop])
		for (const m of [conditions.base, conditions.initial, conditions.multisource]) {
			for (const method of m) {
				expect(method).toSatisfy(m => m in methods)
			}
		}
	})

	test("Generate negated, monosource methods", () => {
		const methods = waitFor(noop).not
		for (const m of [conditions.base, conditions.monosource]) {
			for (const method of m) {
				expect(method).toSatisfy(m => m in methods)
			}
		}
	})
})

suite("toFulfill", () => {
	test("Resolve when custom condition returns true", async () => {
		const count = shallowRef(10)
		const methods = waitFor(count)
		const spy = vi.spyOn(methods, 'toFulfill')

		await methods.toFulfill(v => {
			if (v < 0) {
				return true
			} else {
				count.value--
			}
		})
		expect(spy).toHaveResolved()
	})

	test("Resolve when custom condition returns false", async () => {
		const count = shallowRef(-10)
		const methods = waitFor(count).not
		const spy = vi.spyOn(methods, 'toFulfill')

		await methods.toFulfill(v => {
			if (v < 0) {
				count.value++
			} else {
				return false
			}
		})
		expect(spy).toHaveResolved()
	})
})

suite("toChange", () => {
	test("Resolve after source changes n times", async () => {
		const n = 10
		const src = shallowRef(0)
		const methods = waitFor(src)
		const spy = vi.spyOn(methods, 'toChange')

		queueMicrotask(async () => {
			for (let i=0; i<n; i++) {
				src.value++
				await nextTick()
			}
		})

		await methods.toChange(n)
		expect(spy).toHaveResolved()
	})

	test("Resolve after multiple sources change n times", async () => {
		const n = 10
		const sources = [shallowRef(0), shallowRef(0), shallowRef(0)]
		const methods = waitFor(sources)
		const spy = vi.spyOn(methods, 'toChange')

		queueMicrotask(async () => {
			for (let i=0; i<n; i++) {
				sources[i % 3]!.value++
				await nextTick()
			}
		})

		await methods.toChange(n)
		expect(spy).toHaveResolved()
	})

	test("Resolve after source changes n times with reactive n", async () => {
		const n = shallowRef(1)
		const src = shallowRef(0)
		const methods = waitFor(src)
		const spy = vi.spyOn(methods, 'toChange')

		queueMicrotask(async () => {
			for (let i=0; i<n.value; i++) {
				if (n.value < 10) {
					n.value++
				}
				src.value++
				await nextTick()
			}
		})

		await methods.toChange(n)
		expect(spy).toHaveResolved()
	})

	test("Resolve if reactive argument becomes less than current number of source changes", async () => {
		const n = shallowRef(10)
		const src = shallowRef(0)
		const methods = waitFor(src)
		const spy = vi.spyOn(methods, 'toChange')

		queueMicrotask(async () => {
			for (let i=0; i<9; i++) {
				src.value++
				await nextTick()
			}
			n.value = 8
		})

		await methods.toChange(n)
		expect(spy).toHaveResolved()
	})

	test("Resolve after multiple sources change n times with reactive n", async () => {
		const n = shallowRef(1)
		const sources = [shallowRef(0), shallowRef(0), shallowRef(0)]
		const methods = waitFor(sources)
		const spy = vi.spyOn(methods, 'toChange')

		queueMicrotask(async () => {
			for (let i=0; i<n.value; i++) {
				if (n.value < 10) {
					n.value++
				}
				sources[i % 3]!.value++
				await nextTick()
			}
		})

		await methods.toChange(n)
		expect(spy).toHaveResolved()
	})
})

suite("toBe", () => {
	const src = shallowRef()
	const waitForSrc = waitFor(src)
	const spy = vi.spyOn(waitForSrc, 'toBe')

	test("Resolve when source is the same as argument", async () => {
		const values = [
			'vergil',
			true,
			{},
			shallowRef(null),
			shallowRef([]),
			0,
			-0,
			NaN
		]
		for (const value of values) {
			spy.mockClear()
			queueMicrotask(async () => {
				src.value = undefined
				await nextTick()
				expect(spy).not.toHaveResolved()
				src.value = toValue(value)
			})

			await waitForSrc.toBe(value)
			expect(spy).toHaveResolved()
		}
	})

	test("Resolve when reactive argument is the same as source", async () => {
		const values: ShallowRef<unknown>[] = [
			shallowRef('vergil'),
			shallowRef(true),
			shallowRef(null),
			shallowRef({}),
			shallowRef(0),
			shallowRef(-0),
			shallowRef(NaN),
		]
		for (const value of values) {
			spy.mockClear()
			queueMicrotask(async () => {
				value.value = undefined
				await nextTick()
				expect(spy).not.toHaveResolved()
				value.value = src.value
			})

			await waitForSrc.toBe(value)
			expect(spy).toHaveResolved()
		}
	})

	test("Resolve when source and argument are not the same", async () => {
		const src = shallowRef(NaN)
		const waitForSrcNot = waitFor(src).not
		const spy = vi.spyOn(waitForSrcNot, 'toBe')
		
		queueMicrotask(async () => {
			triggerRef(src)
			await nextTick()
			expect(spy).not.toHaveResolved()
			src.value = 1
		})

		await waitForSrcNot.toBe(NaN)
	})
})

suite("toEqual", () => {
	const src = shallowRef()
	const waitForSrc = waitFor(src)
	const spy = vi.spyOn(waitForSrc, 'toBe')

	test("Resolve when source equals argument", async () => {
		const values = [
			8,
			'vergil',
			true,
			{},
			shallowRef(null),
			shallowRef([])
		]
		for (const value of values) {
			spy.mockClear()
			queueMicrotask(async () => {
				src.value = 0
				await nextTick()
				expect(spy).not.toHaveResolved()
				src.value = toValue(value)
			})

			await waitForSrc.toBe(value)
			expect(spy).toHaveResolved()
		}
	})

	test("Resolve when reactive argument equals source", async () => {
		const values = [
			shallowRef(8),
			shallowRef('vergil'),
			shallowRef(true),
			shallowRef(null),
			shallowRef({})
		]
		for (const value of values) {
			spy.mockClear()
			queueMicrotask(async () => {
				value.value = 0
				await nextTick()
				expect(spy).not.toHaveResolved()
				value.value = src.value
			})

			await waitForSrc.toBe(value)
			expect(spy).toHaveResolved()
		}
	})

	test("Resolve when source and argument are different", async () => {
		const src = shallowRef(0)
		const waitForSrcNot = waitFor(src).not
		const spy = vi.spyOn(waitForSrcNot, 'toBe')
		
		queueMicrotask(async () => {
			triggerRef(src)
			await nextTick()
			expect(spy).not.toHaveResolved()
			src.value = 1
		})

		await waitForSrcNot.toBe(-0)
	})
})

suite("toBeIn", () => {
	const src = shallowRef()
	const waitForSrc = waitFor(src)
	const spy = vi.spyOn(waitForSrc, 'toBeIn')

	test("Resolve when source is in argument array", async () => {
		const arrays: MaybeRef<unknown[]>[] = [
			[0, 0, 0, 8],
			[0, 0, 0, 'vergil'],
			[0, 0, 0, {}],
			shallowRef([0, 0, 0, null])
		]
		for (const arr of arrays) {
			spy.mockClear()
			queueMicrotask(async () => {
				src.value = ''
				await nextTick()
				expect(spy).not.toHaveResolved()
				src.value = toValue(arr).at(-1)
			})

			await waitForSrc.toBeIn(arr)
			expect(spy).toHaveResolved()
		}
	})

	test("Resolve when reactive argument contains source", async () => {
		const arrays: ShallowRef<unknown[]>[] = [
			shallowRef([0, 0, 0, 8]),
			shallowRef([0, 0, 0, 'vergil']),
			shallowRef([0, 0, 0, null]),
			shallowRef([0, 0, 0, {}]),
		]
		for (const arr of arrays) {
			spy.mockClear()
			queueMicrotask(async () => {
				arr.value = []
				await nextTick()
				expect(spy).not.toHaveResolved()
				arr.value = [src.value]
			})

			await waitForSrc.toBeIn(arr)
			expect(spy).toHaveResolved()
		}
	})

	test("Resolve when source is not in argument array", async () => {
		const src = shallowRef(0)
		const waitForSrcNot = waitFor(src).not
		const spy = vi.spyOn(waitForSrcNot, 'toBeIn')
		
		queueMicrotask(async () => {
			triggerRef(src)
			await nextTick()
			expect(spy).not.toHaveResolved()
			src.value = 1
		})

		await waitForSrcNot.toBeIn([0])
	})
})

suite("toBeTruthy", () => {
	test("Resolve when source is truthy", async () => {
		const src = shallowRef()
		const waitForSrc = waitFor(src)
		const spy = vi.spyOn(waitForSrc, 'toBeTruthy')
	
		for (const value of [true, 1, '1', {}, []]) {
			spy.mockClear()
			queueMicrotask(async () => {
				src.value = false
				await nextTick()
				expect(spy).not.toHaveResolved()
				src.value = value
			})
	
			await waitForSrc.toBeTruthy()
			expect(spy).toHaveResolved()
		}
	})
	
	test("Resolve when source is falsy", async () => {
		const src = shallowRef()
		const waitForSrcNot = waitFor(src).not
		const spy = vi.spyOn(waitForSrcNot, 'toBeTruthy')
	
		for (const value of [false, 0, '', null, undefined]) {
			spy.mockClear()
			queueMicrotask(async () => {
				src.value = true
				await nextTick()
				expect(spy).not.toHaveResolved()
				src.value = value
			})
	
			await waitForSrcNot.toBeTruthy()
			expect(spy).toHaveResolved()
		}
	})
})

suite("toContain", () => {
	const src = shallowRef<any[]>([])
	const waitForSrc = waitFor(src)
	const spy = vi.spyOn(waitForSrc, 'toContain')

	test("Resolve when source contains argument", async () => {
		const values = [
			8,
			'vergil',
			true,
			{},
			shallowRef(null),
			shallowRef([])
		]
		for (const value of values) {
			spy.mockClear()
			queueMicrotask(async () => {
				src.value = []
				await nextTick()
				expect(spy).not.toHaveResolved()
				src.value = [toValue(value)]
			})

			await waitForSrc.toContain(value)
			expect(spy).toHaveResolved()
		}
	})

	test("Resolve when reactive argument is in source", async () => {
		src.value = [0]
		const values = [
			shallowRef(8),
			shallowRef('vergil'),
			shallowRef(true),
			shallowRef(null),
			shallowRef({})
		]
		for (const value of values) {
			spy.mockClear()
			queueMicrotask(async () => {
				value.value = 1
				await nextTick()
				expect(spy).not.toHaveResolved()
				value.value = 0
			})

			await waitForSrc.toContain(value)
			expect(spy).toHaveResolved()
		}
	})

	test("Resolve when source does not contain argument", async () => {
		const src = shallowRef([0])
		const waitForSrcNot = waitFor(src).not
		const spy = vi.spyOn(waitForSrcNot, 'toContain')
		
		queueMicrotask(async () => {
			triggerRef(src)
			await nextTick()
			expect(spy).not.toHaveResolved()
			src.value = []
		})

		await waitForSrcNot.toContain(0)
	})
})

suite("toBeEqual", () => {
	test("Resolve when sources are equal", async () => {
		const sources = [shallowRef(), shallowRef(), shallowRef(null)] as const
		const waitForSources = waitFor(sources)
		const spy = vi.spyOn(waitForSources, 'toBeEqual')
	
		queueMicrotask(async () => {
			sources[0].value = null
			await nextTick()
			expect(spy).not.toHaveResolved()
			sources[1].value = null
		})
	
		await waitForSources.toBeEqual()
		expect(spy).toHaveResolved()
	})

	test("Resolve when sources are not equal", async () => {
		const sources = [shallowRef(0), shallowRef(0), shallowRef(0)]
		const waitForSourcesNot = waitFor(sources).not
		const spy = vi.spyOn(waitForSourcesNot, 'toBeEqual')

		queueMicrotask(async () => {
			triggerRef(sources[0]!)
			await nextTick()
			expect(spy).not.toHaveResolved()
			sources[1]!.value = 1
		})

		await waitForSourcesNot.toBeEqual()
		expect(spy).toHaveResolved()
	})
})

test("Resolve if condition is initially fulfilled", async () => {
	await expect(
		waitFor(getTrue).toFulfill(v => String(v) === 'true')
	).resolves.toBeDefined()

	await expect(
		waitFor(getTrue).toBe(true)
	).resolves.toBeDefined()

	await expect(
		waitFor(getTrue).toEqual(true)
	).resolves.toBeDefined()

	await expect(
		waitFor(getTrue).toBeIn([true])
	).resolves.toBeDefined()

	await expect(
		waitFor(getTrue).toBeTruthy()
	).resolves.toBeDefined()

	await expect(
		waitFor(() => [true]).toContain(true)
	).resolves.toBeDefined()
})