import type { UnwrapRef	} from "vue"
import type { Model, ModelOptions, ModelGroupImpl, ModelGroupInternal } from "#composables"
import type { Prettify } from "#utilities"

export type ModelGroupPayload<F extends ModelGroupFields = ModelGroupFields> = {
	[K in keyof F]: F[K] extends ModelSpec<infer T>
		? T
		: F[K] extends ModelGroupSpec<infer T>
			? ModelGroupPayload<T>
			: never
}

type ModelGroupPath<F extends ModelGroupFields> = Prettify<{
	[K in keyof F]: F[K] extends ModelGroupSpec<infer T>
		? `${string & K}.${string & ModelGroupPath<T>}`
		: F[K] extends ModelSpec
			? K
			: never
}[keyof F]>

export type ModelGroupValidator<F extends ModelGroupFields = ModelGroupFields> = (
	payload: ModelGroupPayload<F>,
	error: (path: ModelGroupPath<F>, msg: string) => void,
	isValid: (path: ModelGroupPath<F>) => boolean
) => void;

export type ModelGroupFields = { [Key: string]: ModelSpec | (ModelGroupFields & ModelGroupInternal) }

export type ModelGroupSpec<F extends ModelGroupFields = ModelGroupFields> = {
	[K in keyof F]: F[K];
} & ModelGroupInternal

export interface ModelSpec<
	T = unknown,
	Shallow extends boolean = boolean,
	ExtendRef extends boolean = boolean,
	IncludeExposed extends boolean = boolean,
	IncludeElements extends boolean = boolean
> extends ModelOptions<any, Shallow, ExtendRef, IncludeExposed, IncludeElements> {
	value: T;
	formLabel?: string;
}

export type ModelGroup<
	F extends ModelGroupFields,
	HasValidator extends boolean = false // oxlint-disable-line no-unused-vars
> = ModelGroupImpl & {
	[K in keyof F]: F[K] extends ModelSpec<infer T, infer Shallow, infer ExtendRef, infer IncludeExposed, infer IncludeElements>
		? Model<
			ExtendRef extends true ? T : UnwrapRef<T>,
			boolean extends Shallow ? false : Shallow,
			boolean extends IncludeExposed ? false : IncludeExposed,
			boolean extends IncludeElements ? false : IncludeElements
		>
		: F[K] extends ModelGroupSpec<infer E>
			? ModelGroup<E>
			: never
}

export type ExtractModelGroupPayload<T> = T extends ModelGroup<infer F> ? ModelGroupPayload<F> : never