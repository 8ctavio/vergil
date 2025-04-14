import type { MaybeRefOrGetter, UnwrapRef } from "vue"
import type { Entangled, EntangledExtension, EntangledOptions, NormalizeRef } from "."

export type ExtendedRefOptions<T = unknown, U = T> = {
	shallow?: boolean;
	get?: () => T;
	set?: (value: U) => void;
} & EntangledOptions

export type ExtendedRefExtension<
	E extends object,
	O extends ExtendedRefOptions = {},
	I extends PropertyKey = never
> = EntangledExtension<E, O, 'ref' | 'value' | I>

export type ExtendedRef<
	T extends MaybeRefOrGetter = unknown,
	U = UnwrapRef<T>,
	E extends object = {},
	O extends ExtendedRefOptions<UnwrapRef<T>, U> = {}
> = {
	get value(): UnwrapRef<T>;
	set value(v: U);
	ref: NormalizeRef<T, 'shallow' extends keyof O
		? O['shallow'] extends boolean
			? O['shallow']
			: false
		: false
	>
} & Entangled<EntangledExtension<E,O, 'ref' | 'value'>>