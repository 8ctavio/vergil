import type { Ref, MaybeRefOrGetter, WatchCallback, PropType } from "vue"
import type { ModelImpl, ModelWrapperImpl, Exposed, Elements } from "#composables"
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

export type UnknownModel = ModelImpl<unknown, boolean, boolean, Ref<unknown>> & {
	exposed?: Exposed
	elements?: Elements
}

export interface DefineModelOptions<
	IncludeExposed extends boolean = boolean,
	CaptureExposed extends boolean = boolean,
	IncludeElements extends boolean = boolean,
	CaptureElements extends boolean = boolean
> {
	/**
	 * Whether to include an `exposed` object into the model wraper.
	 * @default false
	 */
	includeExposed?: IncludeExposed;
	/**
	 * Whether to attach to the model wrapper the `exposed` object
	 * provided to its associated component (either through a model
	 * or the `exposed` prop).
	 * @default false
	 */
	captureExposed?: CaptureExposed;
	/**
	 * Whether to include an `elements` object into the model wraper.
	 * @default false
	 */
	includeElements?: IncludeElements;
	/**
	 * Whether to attach to the model wrapper the `elements` object
	 * provided to its associated component (either through a model
	 * or the `exposed` prop).
	 * @default false
	 */
	captureElements?: CaptureElements;
	/**
	 * Whether the model value could be an object.
	 * @default false
	 */
	maybeObject?: boolean;
}

export type InternalModelUpdateCallback<T = unknown, U extends boolean = boolean> = (
	value: T,
	oldValue: MaybeUndefined<T,U>
) => any;
export type ExternalModelUpdateCallback<T = unknown, U extends boolean = boolean> = (
	value: T,
	oldValue: MaybeUndefined<T,U>,
	isProgrammatic: boolean,
	onCleanup: Parameters<WatchCallback>[2]
) => any;

export type ModelWrapper<
	T = unknown,
	IncludeExposed extends boolean = boolean,
	CaptureExposed extends boolean = boolean,
	IncludeElements extends boolean = boolean,
	CaptureElements extends boolean = boolean
> = ModelWrapperImpl<T>
	& { update(v: unknown): void }
	& (IncludeExposed extends true ? { exposed: Elements }
		: (IncludeExposed | CaptureExposed) extends false ? unknown
		: { exposed?: Elements })
	& (IncludeElements extends true ? { elements: Elements }
		: (IncludeElements | CaptureElements) extends false ? unknown
		: { elements?: Elements })

export type ModelValueProp<T> = PropType<Model<T> | ModelWrapper<T> | T>
export type ModelValidatorProp<T> = PropType<ModelOptions<T>['validator']>