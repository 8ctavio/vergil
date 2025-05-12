import { ModelGroup } from "../functions"
import type { UnwrapRef	} from "vue"
import type { Model, ModelOptions, Prettify } from "."

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

type ModelGroupInternal = {
	readonly __modelGroup: true;
	readonly __validator: ModelGroupValidator;
}

export type ModelGroupFields = { [Key: string]: ModelSpec | (ModelGroupFields & ModelGroupInternal) }

export type ModelGroupFieldsConstraint<F extends ModelGroupFields = ModelGroupFields> = {
	[K in keyof F]: F[K] extends ModelGroupInternal
		? F[K]
		: F[K] extends ModelSpec<infer V>
			? { validator?: ModelOptions<V>['validator'] }
			: F[K]
}

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

export type ModelGroupInstance<
	F extends ModelGroupFields = ModelGroupFields,
	HasValidator extends boolean = false // oxlint-disable-line no-unused-vars
> = ModelGroup & {
	[K in keyof F]: F[K] extends ModelSpec<infer T, infer Shallow, infer ExtendRef, infer IncludeExposed, infer IncludeElements>
		? Model<
			ExtendRef extends true ? T : UnwrapRef<T>,
			boolean extends Shallow ? false : Shallow,
			boolean extends IncludeExposed ? false : IncludeExposed,
			boolean extends IncludeElements ? false : IncludeElements
		>
		: F[K] extends ModelGroupSpec<infer E>
			? ModelGroupInstance<E>
			: never
}