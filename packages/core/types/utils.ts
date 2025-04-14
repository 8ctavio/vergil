export type Prettify<T extends object> = { [K in keyof T]: T[K] } & {}

export type DeepOptional<T> = {
	[K in keyof T]?: T[K] extends object
		? T[K] extends Function
			? T[K]
			: DeepOptional<T[K]>
		: T[K]
}