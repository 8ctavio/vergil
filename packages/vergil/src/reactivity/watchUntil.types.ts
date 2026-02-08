import type { WatchSource, WatchCallback } from "vue"
import type { Writable } from "#utilities"
import type { UnwrapSources } from "#types/reactivity/common"

export type WatchUntilOptions = {
	/**
	 * The return value required to stop the watcher.
	 * Defaults to `true`.
	 * @default true
	 */
	fulfill?: unknown;
	signal?: AbortSignal;
	deep?: boolean | number;
	flush?: 'pre' | 'post' | 'sync';
}

export type WatchUntilCallback<T, O extends WatchUntilOptions> = T extends WatchSource<infer V>
	? (...args: Parameters<WatchCallback<V, V | undefined>>) =>
		| (O extends { fulfill: infer F } ? F : boolean)
		| void
	: T extends readonly WatchSource[]
		? (...args: Parameters<WatchCallback<UnwrapSources<Writable<T>,false>, UnwrapSources<Writable<T>,true>>>) =>
			| (O extends { fulfill: infer F } ? F : boolean)
			| void
		: never

export type WatchUntilPromise<T> = T extends WatchSource<infer V>
	? Promise<V>
	: T extends readonly WatchSource[]
		? Promise<UnwrapSources<T,false>>
		: never