import type { Ref, ShallowRef } from 'vue'

export type NormalizeRef<T, S extends boolean = false> = T extends Ref
	? T
	: T extends () => infer V
		? Readonly<Ref<V>>
		: S extends true ? ShallowRef<T> : Ref<T>