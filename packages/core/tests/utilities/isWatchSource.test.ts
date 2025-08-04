import { test, expect } from 'vitest'
import { ref, shallowRef, customRef, toRef, reactive } from 'vue'
import { useModel } from '../../composables'
import { isWatchSource, noop } from '../../utilities'

test('Assert argument is a watch source', () => {
	const model = useModel('')

	for (const watchSource of [
		ref(),
		shallowRef(),
		customRef(() => ({ get: noop, set: noop })),
		toRef(undefined),
		() => {},
		model.ref,
		() => model.value
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
		model,
		model.value
	]) {
		expect(isWatchSource(notWatchSource)).toBe(false)
	}
})