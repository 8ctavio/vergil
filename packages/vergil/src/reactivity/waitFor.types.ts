import type { MaybeRefOrGetter, WatchSource, WatchCallback } from 'vue'
import type { TypeOfResult } from '#utilities'
import type { WatcherCallback } from '#types/reactivity/common'
import type { WatchUntilPromise } from '#types/reactivity/watchUntil'

interface WaitForMethod<
	T,
	S extends WatchSource | WatchSource[]
> {
	method<V extends MaybeRefOrGetter<T>>(value: V): V extends WatchSource
		? WatchUntilPromise<[S,V]>
		: WatchUntilPromise<S>
	method(value: MaybeRefOrGetter<T>): Promise<unknown>
}

export type WaitForMethods<
	S extends WatchSource | WatchSource[] = WatchSource | WatchSource[],
	F extends boolean = true
> = {
	toFulfill(condition: WatcherCallback<S,true>): WatchUntilPromise<S>;
	toFulfill(condition: WatchCallback): Promise<unknown>;
} & (
	F extends true ? {
		toChange<T extends MaybeRefOrGetter<number>>(times?: T): T extends WatchSource
			? WatchUntilPromise<[...(S extends WatchSource[] ? S : [S]), T]>
			: WatchUntilPromise<S>;
		toChange(times?: MaybeRefOrGetter<number>): Promise<unknown>

		get not(): WaitForMethods<S, false>;
	} : {}
) & (
	S extends readonly WatchSource[] ? {
		toBeEqual(): WatchUntilPromise<S>
	} : {
		toBe: WaitForMethod<unknown, S>["method"]
		toEqual: WaitForMethod<unknown, S>["method"]
		toBeIn: WaitForMethod<unknown[], S>["method"]
		toContain: WaitForMethod<unknown, S>["method"]
		toBeOfType: WaitForMethod<TypeOfResult, S>["method"]
		toBeTruthy(): WatchUntilPromise<S>
		toMatch: WaitForMethod<RegExp, S>["method"]
	}
)