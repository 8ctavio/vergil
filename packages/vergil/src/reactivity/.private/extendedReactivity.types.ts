import type { MaybeRefOrGetter, Ref } from "vue"
import type { Entangled, ExtendedRef, UnwrapRefOrGetter } from "#reactivity"
import type { Prettify, ValueOf, DescriptorMarked } from "#utilities"

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

export type EntangledUnwrappedPropertyKeys<
	P extends Record<PropertyKey, unknown>,
	Ignore extends PropertyKey
> = ValueOf<{
	[K in Exclude<keyof P, Ignore>]: P[K] extends Ref
		? K
		: P[K] extends DescriptorMarked<infer D>
			? D extends { value: infer V }
				? V extends Ref
					? D extends { unwrap: false }
						? never
						: K
					: never
				: never
			: never
}> | (string & {})

export type EntangledUnwrappedPropertyRefs<
	P extends Record<PropertyKey, unknown>,
	K extends keyof P
> = P[K] extends Ref
	? P[K]
	: P[K] extends DescriptorMarked<infer D>
		? D extends { value: infer V }
			? V extends Ref
				? D extends { unwrap: infer U }
					? U extends false ? undefined : V
					: V
				: undefined
			: undefined
		: undefined

export type ExtendedRefImplOptions<
	T extends MaybeRefOrGetter = unknown,
	U = UnwrapRefOrGetter<T>,
	Shallow extends boolean = boolean
> = {
	/**
	 * Whether the created extendedRef's underlying ref is shallow.
	 * @default false
	 */
	shallow?: Shallow
	/**
	 * Custom extendedRef's `value` getter function.
	 */
	get?: () => UnwrapRefOrGetter<T>
	/**
	 * Custom extendedRef's `value` setter function.
	 */
	set?: (value: U) => void
}