import type { Ref, ShallowRef, MaybeRefOrGetter, WatchSource, WatchCallback } from 'vue'
import type { MaybeUndefined, Includes } from '.'

export type NormalizeRef<T, S extends boolean = false> = T extends Ref
	? T
	: T extends () => infer V
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
		? WatchCallback<UnwrapSources<T,false>, UnwrapSources<T,U>>
		: never

export type UnwrapSources<T extends readonly WatchSource[], U extends boolean> = {
	[K in keyof T]: T[K] extends WatchSource<infer V>
		? MaybeUndefined<V,U>
		: never
}

export type WatchUntilOptions = {
	fulfill?: unknown;		// `callback` return value that stops the watcher. Defaults to `true`.
	timeout?: number;		// Duration of watcher timeout in milliseconds. If set and `callback` is not fulfilled after `timeout` milliseconds, the watcher stops.
	signal?: AbortSignal;	// `AbortSignal` to abort watcher with a corresponding [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
	deep?: boolean | number;
	flush?: 'pre' | 'post' | 'sync';
}

export type WatchUntilPromise<T, O extends WatchUntilOptions> = T extends WatchSource<infer V>
	? Promise<MaybeUndefined<V, Includes<O, 'timeout', number>>>
	: T extends readonly WatchSource[]
		? Promise<MaybeUndefined<UnwrapSources<T,false>, Includes<O, 'timeout', number>>>
		: never

export type WaitForMethods<
	S extends WatchSource | WatchSource[] = WatchSource | WatchSource[],
	O extends WatchUntilOptions = {},
	F extends boolean = true
> = {
	toMatch(condition: WatcherCallback<S,true>): WatchUntilPromise<S,O>;
	toMatch(condition: WatchCallback): Promise<unknown>;
} & (
	F extends true ? {
		toChange<T extends MaybeRefOrGetter<number>>(times?: T): T extends WatchSource
			? WatchUntilPromise<[...(S extends WatchSource[] ? S : [S]), T],O>
			: WatchUntilPromise<S,O>;
		toChange(times?: MaybeRefOrGetter<number>): Promise<unknown>

		get not(): WaitForMethods<S,O,false>;
	} : {}
) & (
	S extends WatchSource[] ? {
		toBeEqual(): WatchUntilPromise<S,O>
	} : {
		toBe<T extends MaybeRefOrGetter>(value: T): T extends WatchSource
			? WatchUntilPromise<[S,T],O>
			: WatchUntilPromise<S,O>
		toBe(value: MaybeRefOrGetter): Promise<unknown>

		toBeIn<T extends MaybeRefOrGetter<unknown[]>>(value: T): T extends WatchSource
			? WatchUntilPromise<[S,T],O>
			: WatchUntilPromise<S,O>
		toBeIn(value: MaybeRefOrGetter<unknown[]>): Promise<unknown>

		toBeTruthy(): WatchUntilPromise<S,O>
		toBeNaN(): WatchUntilPromise<S,O>

		toContain<T extends MaybeRefOrGetter>(value: T): T extends WatchSource
			? WatchUntilPromise<[S,T],O>
			: WatchUntilPromise<S,O>
		toContain(value: MaybeRefOrGetter): Promise<unknown>
	}
)