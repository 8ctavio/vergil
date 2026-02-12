export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type IsAny<T, True = true, False = false> = 0 extends 1 & T ? True : False

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

export type Capitalize<S extends string> = S extends `${infer First}${infer Rest}`
	? `${Uppercase<First>}${Rest}`
	: S