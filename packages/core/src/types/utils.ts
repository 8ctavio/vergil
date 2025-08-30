export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type ToArray<T> = T extends any ? T[] : never
export type MaybeArray<T> = T | ToArray<T>

type ToTuple<T, N extends number, R extends readonly unknown[]> = R['length'] extends N ? R : ToTuple<T, N, [T, ...R]>
export type Tuple<T, N extends number> = ToTuple<T, N, []>

export type MaybeUndefined<T, U extends boolean> = U extends true ? T | undefined : T

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