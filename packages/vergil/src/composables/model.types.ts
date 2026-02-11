import type { MaybeRefOrGetter, WatchCallback, WatchOptions, PropType } from "vue"
import type { ModelImpl, Exposed, Elements } from "#composables"
import type { MaybeUndefined } from "#utilities"

export interface ModelOptions<
	T = unknown,
	Shallow extends boolean = boolean,
	ExtendRef extends boolean = boolean,
	IncludeExposed extends boolean = boolean,
	IncludeElements extends boolean = boolean
> {
	/**
	 * Function to peform model-value validation
	 * and collect encountered validation errors.
	 */
	validator?(value: T, error: (msg: string) => void, checkpoint: () => void): void
	/**
	 * Whether to use `shallowRef` for the model's
	 * internal `ref` object. Defaults to `false`.
	 */
	shallow?: Shallow
	/**
	 * If `useModel`'s `value` parameter is a ref,
	 * whether to use it as the model's underlying
	 * `ExtendedRef.ref` object. When set to `false`,
	 * a `value` ref is instead used as a dynamic
	 * source of reset values. Defaults to `false`.
	 */
	extendRef?: ExtendRef
	/**
	 * Value the model is reset to upon calling its
	 * `reset` method. Defaults to the model's initial
	 * value if `extendRef` is `true`; otherwise, defaults
	 * to `useModel`'s `value` parameter (if `value` is a
	 * function, `toRef(value)` is used instead).
	 */
	resetValue?: MaybeRefOrGetter<T>
	/**
	 * Whether to clone the model's reset value if
	 * it is an object. Defaults to `true` if `resetValue`
	 * is not a ref or getter, and to `false` otherwise.
	 */
	cloneResetValue?: boolean
	/**
	 * Whether to include the `exposed` object
	 * into the model. Defaults to `false`.
	 */
	includeExposed?: IncludeExposed
	/**
	 * Whether to include the `elements` object
	 * into the model. Defaults to `false`.
	 */
	includeElements?: IncludeElements
}

export type Model<
	T extends MaybeRefOrGetter = unknown,
	Shallow extends boolean = boolean,
	ExtendedRef extends boolean = boolean,
	IncludeExposed extends boolean = boolean,
	IncludeElements extends boolean = boolean
> = ModelImpl<T, Shallow, ExtendedRef> & (
	boolean extends IncludeExposed ? { exposed?: Exposed }
	: IncludeExposed extends true ? { exposed: Exposed }
	: unknown
) & (
	boolean extends IncludeElements ? { elements?: Elements }
	: IncludeElements extends true ? { elements: Elements }
	: unknown
)

export interface PrivateModel {
	hasInteractiveCtx: boolean;
	resetInteractiveCtx: boolean;
	triggerIfShallow(): void;
	handleValidation(eager?: boolean): void;
	useDebouncedValidation(minWait: number, options?: { eager?: boolean }): (eager?: boolean) => void
}

export interface DefineModelOptions<
	IncludeExposed extends boolean,
	CaptureExposed extends boolean,
	IncludeElements extends boolean,
	CaptureElements extends boolean
> {
	isCollection?: boolean;
	includeExposed?: IncludeExposed;
	captureExposed?: CaptureExposed;
	includeElements?: IncludeElements;
	captureElements?: CaptureElements;
}

type OnCleanup = Parameters<WatchCallback>[2]

export type InternalModelUpdateCallback<T = unknown, U extends boolean = false> = (
	value: T,
	oldValue: MaybeUndefined<T,U>
) => any;
export type ExternalModelUpdateCallback<T = unknown, U extends boolean = false> = (
	value: T,
	oldValue: MaybeUndefined<T,U>,
	isProgrammatic: boolean,
	onCleanup: OnCleanup
) => any;

type ExposedResource<
	Resource extends Exposed | Elements,
	Include extends boolean,
	Capture extends boolean
> = Include extends true
	? Resource
	: null | (Capture extends true ? Resource | undefined : never)

export type ModelWrapper<
	T = unknown,
	IncludeExposed extends boolean = boolean,
	CaptureExposed extends boolean = boolean,
	IncludeElements extends boolean = boolean,
	CaptureElements extends boolean = boolean
> = {
	updateDecorator<F extends Function>(fn: F): F;
	update(v: unknown): void;
	onExternalUpdate<Immediate extends boolean = false>(
		callback: ExternalModelUpdateCallback<T, Immediate>,
		options?: Omit<WatchOptions<Immediate>, 'deep'> & { onMounted?: boolean }
	): () => void;
	onInternalUpdate<Immediate extends boolean = false>(
		callback: InternalModelUpdateCallback<T, Immediate>,
		options?: Omit<WatchOptions<Immediate>, 'deep'>
	): () => void;
	exposed: ExposedResource<Exposed, IncludeExposed, CaptureExposed>;
	elements: ExposedResource<Elements, IncludeElements, CaptureElements>;
}	& Omit<PrivateModel, 'hasInteractiveCtx' | 'resetInteractiveCtx'>
	& Omit<Model<T>, 'exposed' | 'elements'>

export type ModelValueProp<T> = PropType<Model<T> | ModelWrapper<T> | T>
export type ModelValidatorProp<T> = PropType<ModelOptions<T>['validator']>