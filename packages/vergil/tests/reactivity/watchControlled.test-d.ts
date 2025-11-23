import { test, expectTypeOf } from "vitest"
import { ref, shallowRef } from 'vue'
import { watchControlled } from "#reactivity"
import { noop } from "#utilities"

test("Return controller methods", () => {
	expectTypeOf(watchControlled(noop, noop)).toExtend<{
		stop: () => void;
		pause: () => void;
		resume: () => void;
		ignore: (cb: () => void) => void;
	}>()
})

test("Callback argument types match source types", () => {
	watchControlled(ref(0), (v,u) => {
		expectTypeOf(v).toEqualTypeOf<number>()
		expectTypeOf(u).toEqualTypeOf<number>()
	})
	watchControlled(() => 0, (v,u) => {
		expectTypeOf(v).toEqualTypeOf<number>()
		expectTypeOf(u).toEqualTypeOf<number | undefined>()
	}, { immediate: true })

	watchControlled(shallowRef<string | number | boolean>(0), (v,u) => {
		expectTypeOf(v).toEqualTypeOf<string | number | boolean>()
		expectTypeOf(u).toEqualTypeOf<string | number | boolean>()
	})
	watchControlled((): string | number | boolean => 0, (v,u) => {
		expectTypeOf(v).toEqualTypeOf<string | number | boolean>()
		expectTypeOf(u).toEqualTypeOf<string | number | boolean | undefined>()
	}, { immediate: true })

	watchControlled(ref<string[]>([]), (v,u) => {
		expectTypeOf(v).toEqualTypeOf<string[]>()
		expectTypeOf(u).toEqualTypeOf<string[]>()
	})
	watchControlled(() => [''], (v,u) => {
		expectTypeOf(v).toEqualTypeOf<string[]>()
		expectTypeOf(u).toEqualTypeOf<string[] | undefined>()
	}, { immediate: true })

	watchControlled([ref(0), shallowRef(''), () => false], (v,u) => {
		expectTypeOf(v).toEqualTypeOf<[number, string, boolean]>()
		expectTypeOf(u).toEqualTypeOf<[number, string, boolean]>()
	})
	watchControlled([ref(0), shallowRef(''), () => false], (v,u) => {
		expectTypeOf(v).toEqualTypeOf<[number, string, boolean]>()
		expectTypeOf(u).toEqualTypeOf<[number | undefined, string | undefined, boolean | undefined]>()
	}, { immediate: true })

	watchControlled([ref(0), shallowRef(''), () => false] as const, (v,u) => {
		expectTypeOf(v).toEqualTypeOf<[number, string, boolean]>()
		expectTypeOf(u).toEqualTypeOf<[number, string, boolean]>()
	})
	watchControlled([ref(0), shallowRef(''), () => false] as const, (v,u) => {
		expectTypeOf(v).toEqualTypeOf<[number, string, boolean]>()
		expectTypeOf(u).toEqualTypeOf<[number | undefined, string | undefined, boolean | undefined]>()
	}, { immediate: true })
})
