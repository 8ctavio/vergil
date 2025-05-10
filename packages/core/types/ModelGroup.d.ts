import type { ModelGroupInstance, ModelGroupFields, ModelGroupFieldsConstraint, ModelGroupValidator, ModelGroupSpec, ModelGroupPayload, Model } from "." 

declare const filterActions: Readonly<{
    SKIP: false;
    ACCEPT: true;
    ACCEPT_CHILDREN: 1;
    ACCEPT_DESCENDANTS: 2;
}>;
type FilterActions = typeof filterActions;
type ModelFilter = ((actions: FilterActions, path: string, isGroup: boolean, value: Model | ModelGroup) => FilterActions[keyof FilterActions]);

export interface ModelGroup {
	new <F extends ModelGroupFields = {}>(fields: F & ModelGroupFieldsConstraint<F>): ModelGroupInstance<F, false>
	new <F extends ModelGroupFields = {}>(fields: F & ModelGroupFieldsConstraint<F>, validator: ModelGroupValidator<F>): ModelGroupInstance<F, true>

	nested<F extends ModelGroupFields = {}>(fields: F & ModelGroupFieldsConstraint<F>, validator?: ModelGroupValidator<F>): ModelGroupSpec<F>

	prototype: {
		reset(): void;
		getPayload<F extends ModelGroupFields>(this: ModelGroupInstance<F>): ModelGroupPayload<F>;
		getPayload(): ModelGroupPayload;
		validate
			<
				F extends ModelGroupFields,
				IncludePayload extends boolean = false,
				HasValidator extends boolean = false	
			>
			(this: ModelGroupInstance<F, HasValidator>, includePayload?: IncludePayload)
			: true extends IncludePayload | HasValidator
				? [boolean, ModelGroupPayload<F>]
				: boolean
		validate
			<IncludePayload extends boolean = false>
			(includePayload?: IncludePayload)
			: true extends IncludePayload ? [boolean, ModelGroupPayload] : boolean
		clear(): void;
		get error(): boolean;
		forErrors(
			callback: (errors: string[], field: string, path: string, model: Model) => void,
			filter?: ModelFilter
		): void;
	}
}