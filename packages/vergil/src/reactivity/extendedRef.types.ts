import type { MaybeRefOrGetter } from "vue"
import type { ExtendedRefImpl, ExtendedRefImplOptions, Entangled, EntangledOptions, UnwrapRefOrGetter } from "#reactivity"

export type ExtendedRefOptions<
	T = unknown,
	U = T,
	Shallow extends boolean = false,
	Ignore extends PropertyKey = never
> = ExtendedRefImplOptions<T, U, Shallow> & EntangledOptions<Ignore>

export type ExtendedRef<
	T extends MaybeRefOrGetter = unknown,
	U = UnwrapRefOrGetter<T>,
	Shallow extends boolean = false,
	Extension extends Record<PropertyKey, unknown> = {},
	Ignore extends PropertyKey = never
> = ExtendedRefImpl<T, U, Shallow> & Entangled<Extension, Ignore | 'ref' | 'value'>