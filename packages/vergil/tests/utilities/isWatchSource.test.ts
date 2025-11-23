import { test, expect } from 'vitest'
import { ref, shallowRef, customRef, toRef, reactive } from 'vue'
import { extendedRef } from '#reactivity'
import { isWatchSource, noop } from '#utilities'

test('Assert argument is a watch source', () => {
	const extended = extendedRef('')

	for (const watchSource of [
		ref(),
		shallowRef(),
		customRef(() => ({ get: noop, set: noop })),
		toRef(undefined),
		() => {},
		extended.ref,
		() => extended.value
	]) {
		expect(isWatchSource(watchSource)).toBe(true)
	}

	for (const notWatchSource of [
		{},
		[],
		reactive({}),
		reactive({ foo: 0 }).foo,
		ref().value,
		true,
		8,
		'vergil',
		null,
		undefined,
		extended,
		extended.value
	]) {
		expect(isWatchSource(notWatchSource)).toBe(false)
	}
})