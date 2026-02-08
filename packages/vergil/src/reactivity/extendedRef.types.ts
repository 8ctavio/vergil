import type { MaybeRefOrGetter } from "vue"
import type { UnwrapRefOrGetter, NormalizeRef } from "#types/reactivity/common"
import type { Entangled, EntangledOptions } from "#types/reactivity/entangled"

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
	U = UnwrapRefOrGetter<T>,
	Extension extends Record<PropertyKey, unknown> = {},
	Shallow extends boolean = false,
	Ignore extends PropertyKey = never
> = {
	get value(): UnwrapRefOrGetter<T>;
	set value(v: U);
	ref: NormalizeRef<T, Shallow>
} & Entangled<Extension, Ignore | 'ref' | 'value'>