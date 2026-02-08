export type TypeOfResult = "object" | "function" | "undefined" | "boolean" | "number" | "bigint" | "string" | "symbol"

export type MaybeArray<T> = T | T[]
export type MaybeUndefined<T, U extends boolean = true> = U extends true ? T | undefined : T
export type Writable<T> = { -readonly [K in keyof T]: T[K] }

export type Includes<O extends object, K extends PropertyKey, T = unknown> = K extends keyof O
	? O[K] extends T
		? true
		: false
	: false

type ToTuple<T, L extends number, Tuple extends readonly unknown[] = []> = Tuple['length'] extends L
	? Tuple
	: ToTuple<T, L, [...Tuple, T]>
export type TupleOf<Type, Length extends number> = ToTuple<Type, Length>