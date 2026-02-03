export type Prettify<T> = { [K in keyof T]: T[K] } & {}
export type Writable<T> = { -readonly [K in keyof T]: T[K] }

export type MaybeArray<T> = T | T[]

type ToTuple<T, L extends number, Tuple extends readonly unknown[] = []> = Tuple['length'] extends L
	? Tuple
	: ToTuple<T, L, [...Tuple, T]>
export type TupleOf<Type, Length extends number> = ToTuple<Type, Length>

export type MaybeUndefined<T, U extends boolean = true> = U extends true ? T | undefined : T

export type DeepOptional<T> = {
	[K in keyof T]?: T[K] extends object
		? T[K] extends Function
			? T[K]
			: DeepOptional<T[K]>
		: T[K]
}

export type Includes<O extends object, K extends PropertyKey, T = unknown> = K extends keyof O
	? O[K] extends T
		? true
		: false
	: false

export interface Debounced {
	(this: unknown, ...args: unknown[]): void;
	cancel: () => void;
}