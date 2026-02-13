import type { Ref, ShallowRef, UnwrapRef, WatchSource, WatchCallback } from "vue"
import type { Writable, MaybeUndefined } from "#utilities"

export type UnwrapRefOrGetter<T> = T extends () => infer R ? R : UnwrapRef<T>

export type NormalizeRef<T, S extends boolean = false> = [T] extends [Ref]
	? T
	: [T] extends [() => infer V]
		? Readonly<Ref<V>>
		: S extends true ? ShallowRef<T> : Ref<T>

export type WatcherSource<T> = T extends WatchSource
	? T
	: T extends readonly WatchSource[]
		? readonly [...T]
		: never

export type WatcherCallback<T, U extends boolean> = T extends WatchSource<infer V>
	? WatchCallback<V, MaybeUndefined<V,U>>
	: T extends readonly WatchSource[]
		? WatchCallback<UnwrapSources<Writable<T>,false>, UnwrapSources<Writable<T>,U>>
		: never

export type UnwrapSources<T extends readonly WatchSource[], U extends boolean> = {
	[K in keyof T]: T[K] extends WatchSource<infer V>
		? MaybeUndefined<V,U>
		: never
}