import type { Ref } from "vue"
import type { Entangled, ExtendedRef } from "#reactivity"
import type { Prettify, DescriptorMarked } from "#utilities"

export type EntangledProperties<
	P extends Record<PropertyKey, unknown>,
	Ignore extends PropertyKey
> = Omit<{
	[K in keyof P]: P[K] extends Ref<infer V>
		? V
		: P[K] extends DescriptorMarked<infer D>
			? 'value' extends keyof D
				? D['value'] extends Ref<infer V>
					? 'unwrap' extends keyof D
						? D['unwrap'] extends false
							? D['value']
							: V | D['value']
						: V
					: D['value']
				: 'get' extends keyof D
					? D['get'] extends (...args: any) => infer V
						? V
						: undefined
					: undefined
			: P[K]
}, Ignore>

type ExtractEntangled<T>
	= T extends ExtendedRef<never, never, never, infer E> ? E
	: T extends Entangled<infer P> ? P
	: T

export type WithEntangled<
	O extends object,
	P extends Record<PropertyKey, unknown>,
	Ignore extends PropertyKey
> = O extends ExtendedRef<infer V, infer U, infer S, infer E, infer I>
		? ExtendedRef<V, U, S,
			Prettify<E & ExtractEntangled<P>>,
			Ignore | I
		>
	: O extends Entangled<infer E, infer I>
		? Entangled<
			Prettify<E & ExtractEntangled<P>>,
			Ignore | I
		>
	: O & EntangledProperties<
		ExtractEntangled<P>,
		Ignore
	>