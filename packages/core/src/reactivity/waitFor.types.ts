import type { MaybeRefOrGetter, WatchSource, WatchCallback } from 'vue'
import type { WatcherCallback, WatchUntilOptions, WatchUntilPromise } from '#reactivity'

export type WaitForMethods<
	S extends WatchSource | WatchSource[] = WatchSource | WatchSource[],
	O extends WatchUntilOptions = {},
	F extends boolean = true
> = {
	toFulfill(condition: WatcherCallback<S,true>): WatchUntilPromise<S,O>;
	toFulfill(condition: WatchCallback): Promise<unknown>;
} & (
	F extends true ? {
		toChange<T extends MaybeRefOrGetter<number>>(times?: T): T extends WatchSource
			? WatchUntilPromise<[...(S extends WatchSource[] ? S : [S]), T],O>
			: WatchUntilPromise<S,O>;
		toChange(times?: MaybeRefOrGetter<number>): Promise<unknown>

		get not(): WaitForMethods<S,O,false>;
	} : {}
) & (
	S extends readonly WatchSource[] ? {
		toBeEqual(): WatchUntilPromise<S,O>
	} : {
		toBe<T extends MaybeRefOrGetter>(value: T): T extends WatchSource
			? WatchUntilPromise<[S,T],O>
			: WatchUntilPromise<S,O>
		toBe(value: MaybeRefOrGetter): Promise<unknown>
		toEqual<T extends MaybeRefOrGetter>(value: T): T extends WatchSource
			? WatchUntilPromise<[S,T],O>
			: WatchUntilPromise<S,O>
		toEqual(value: MaybeRefOrGetter): Promise<unknown>

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