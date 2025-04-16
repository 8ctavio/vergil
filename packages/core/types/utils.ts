export type Prettify<T extends object> = { [K in keyof T]: T[K] } & {}

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