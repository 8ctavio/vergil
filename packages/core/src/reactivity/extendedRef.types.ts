import type { MaybeRefOrGetter, UnwrapRef } from "vue"
import type { Entangled, EntangledOptions, NormalizeRef } from "#reactivity"

export interface ExtendedRefOptions<
	T = unknown,
	U = T,
	Shallow extends boolean = false,
	Ignore extends PropertyKey = never
> extends EntangledOptions<Ignore> {
	shallow?: Shallow;
	get?: () => T;
	set?: (value: U) => void;
}

export type ExtendedRef<
	T extends MaybeRefOrGetter = unknown,
	U = UnwrapRef<T>,
	Extension extends Record<PropertyKey, unknown> = {},
	Shallow extends boolean = false,
	Ignore extends PropertyKey = never
> = {
	get value(): UnwrapRef<T>;
	set value(v: U);
	ref: NormalizeRef<T, Shallow>
} & Entangled<Extension, Ignore | 'ref' | 'value'>