import type { WatchSource, WatchCallback } from "vue"
import type { UnwrapSources } from "#reactivity"
import type { Writable, MaybeUndefined, Includes } from "#utilities"

export type WatchUntilOptions = {
	/**
	 * The return value required to stop the watcher.
	 * Defaults to `true`.
	 * @default true
	 */
	fulfill?: unknown;
	/**
	 * Duration of watcher timeout in milliseconds.
	 * If set and `callback` is not fulfilled after
	 * `timeout` milliseconds, the watcher stops.
	 */
	timeout?: number;
	/**
	 * `AbortSignal` to abort watcher with a corresponding
	 * [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
	 */
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

export type WatchUntilPromise<T, O extends WatchUntilOptions> = T extends WatchSource<infer V>
	? Promise<MaybeUndefined<V, Includes<O, 'timeout', number>>>
	: T extends readonly WatchSource[]
		? Promise<MaybeUndefined<UnwrapSources<T,false>, Includes<O, 'timeout', number>>>
		: never