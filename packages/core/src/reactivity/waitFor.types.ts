import type { MaybeRefOrGetter, WatchSource, WatchCallback } from 'vue'
import type { WatcherCallback, WatchUntilOptions, WatchUntilPromise } from '#reactivity'
import type { TypeOfResult } from '#utilities'

interface WaitForMethod<
	T,
	S extends  WatchSource | WatchSource[],
	O extends WatchUntilOptions
> {
	method<V extends MaybeRefOrGetter<T>>(value: V): V extends WatchSource
		? WatchUntilPromise<[S,V], O>
		: WatchUntilPromise<S,O>
	method(value: MaybeRefOrGetter<T>): Promise<unknown>
}

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
		toBe: WaitForMethod<unknown, S,O>["method"]
		toEqual: WaitForMethod<unknown, S,O>["method"]
		toBeIn: WaitForMethod<unknown[], S,O>["method"]
		toContain: WaitForMethod<unknown, S,O>["method"]
		toBeOfType: WaitForMethod<TypeOfResult, S,O>["method"]
		toBeTruthy(): WatchUntilPromise<S,O>
	}
)