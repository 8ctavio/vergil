import type { Model, ModelOptions } from "#composables"
import type { Prettify } from "#utilities"
import type { ModelGroup, ModelGroupImpl, _isNestedGroup_, _validator_, filterActions } from "#functions"

export type ModelGroupFields = {
	[key: string]: ModelSpec | ModelGroupSpec
}

export type ModelSpec<
	T = unknown,
	Shallow extends boolean = boolean,
	ExtendRef extends boolean = boolean,
	IncludeExposed extends boolean = boolean,
	IncludeElements extends boolean = boolean
> = ModelOptions<any, Shallow, ExtendRef, IncludeExposed, IncludeElements> & {
	value: T;
	formLabel?: string;
}

export type ModelGroupSpec<T extends ModelGroupFields = ModelGroupFields> = T & {
	readonly [_isNestedGroup_]: true
	readonly [_validator_]: ModelGroupValidator
}

type ModelGroupPath<F extends ModelGroupFields> = Prettify<{
	[K in keyof F]
		: F[K] extends ModelSpec ? K
		: F[K] extends ModelGroupSpec<infer T> ? `${string & K}.${string & ModelGroupPath<T>}`
		: never
}[keyof F]>

export type ModelGroupValidator<F extends ModelGroupFields = ModelGroupFields> = (
	payload: ModelGroupPayload<F>,
	error: (path: ModelGroupPath<F>, msg: string) => void
) => void

export type ModelGroupPayload<
	F extends ModelGroupFields = ModelGroupFields
> = ModelGroupFields extends F ? Record<string, unknown> : {
	[K in keyof F]
		: F[K] extends ModelSpec<infer T> ? T
		: F[K] extends ModelGroupSpec<infer T> ? ModelGroupPayload<T>
		: never
}

export type ExtractModelGroupPayload<T> = T extends ModelGroupImpl<infer F> ? ModelGroupPayload<F> : never

type FilterActions = typeof filterActions

export type ModelFilter = (
	actions: FilterActions,
	path: string,
	isGroup: boolean,
	value: Model | ModelGroup
) => FilterActions[keyof FilterActions]