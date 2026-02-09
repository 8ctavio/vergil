import type { UnwrapRef	} from "vue"
import type { Model, ModelOptions, ModelGroupImpl, ModelGroupFields, ModelSpec, ModelGroupSpec, ModelGroupValidator } from "#composables"

export type ModelGroupFieldsConstraint<F extends ModelGroupFields = ModelGroupFields> = {
	[K in keyof F]: F[K] extends ModelSpec<infer V>
		? { validator?: ModelOptions<V>['validator'] }
		: unknown
}

export type ModelGroupInstance<
	F extends ModelGroupFields = ModelGroupFields
> = ModelGroupImpl<F> & (ModelGroupFields extends F ? ModelGroupFields : {
	[K in keyof F]
		: F[K] extends ModelSpec<infer T, infer Shallow, infer ExtendRef, infer IncludeExposed, infer IncludeElements>
			? Model<
				ExtendRef extends true ? T : UnwrapRef<T>,
				boolean extends Shallow ? false : Shallow,
				boolean extends IncludeExposed ? false : IncludeExposed,
				boolean extends IncludeElements ? false : IncludeElements
			>
		: F[K] extends ModelGroupSpec<infer E> ? ModelGroupInstance<E>
		: never
})

export type ModelGroupConstructor = Omit<typeof ModelGroupImpl, 'prototype'> & {
	new <F extends ModelGroupFields = ModelGroupFields>(
		fields: F & ModelGroupFieldsConstraint<F>,
		validator?: ModelGroupValidator<F>
	): ModelGroupInstance<F>
}