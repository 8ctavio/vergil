import type { WatchSource, WatchCallback } from "vue"
import type { UnwrapSources } from "#reactivity"
import type { Writable } from "#utilities"

export type DefineExposedCallback<T> = T extends WatchSource<infer V>
	? (...args: Parameters<WatchCallback<V, V | undefined>>) => object | null
	: T extends readonly WatchSource[]
		? (...args: Parameters<WatchCallback<UnwrapSources<Writable<T>,false>, UnwrapSources<Writable<T>,true>>>) => object | null
		: never