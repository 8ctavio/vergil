import type { ModelOptions, ModelSpec, ModelGroupFields, ModelGroupInternal } from "#composables"

export type ModelGroupFieldsConstraint<F extends ModelGroupFields = ModelGroupFields> = {
	[K in keyof F]: F[K] extends ModelGroupInternal
		? F[K]
		: F[K] extends ModelSpec<infer V>
			? { validator?: ModelOptions<V>['validator'] }
			: F[K]
}
