export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type ToCompatible<T, Compatible, UnknownFallback extends Compatible = Compatible> = unknown extends T
	? (UnknownFallback & unknown)
	: (T extends Compatible ? T : never) 

export type RequiredKeys<T, K extends keyof T = keyof T> = T & { [P in K]-?: T[P] }
export type DeepOptional<T> = {
	[K in keyof T]?: T[K] extends object
	? T[K] extends Function
	? T[K]
	: DeepOptional<T[K]>
	: T[K]
}