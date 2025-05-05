import type { ShallowRef, MaybeRefOrGetter, UnwrapRef, WatchCallback, WatchOptions, PropType } from "vue"
import type { ExtendedRef, DescriptorMarked, Exposed, Elements, MaybeUndefined } from "."

type OnCleanup = Parameters<WatchCallback>[2]

export interface ModelOptions<
	T = unknown,
	Shallow extends boolean = false,
	ExtendRef extends boolean = false,
	IncludeExposed extends boolean = false,
	IncludeElements extends boolean = false
> {
	validator?: (value: T, error: (msg: string) => void, checkpoint: () => void) => void;
	shallow?: Shallow;
	extendRef?: ExtendRef;
	includeExposed?: IncludeExposed;
	includeElements?: IncludeElements;
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

export interface PrivateModel {
	hasInteractiveCtx: boolean;
	resetInteractiveCtx: boolean;
	triggerIfShallow(): void;
	handleValidation(eager?: boolean): void;
	useDebouncedValidation(minWait: number, options?: { eager?: boolean }): (eager?: boolean) => void
}

export type Model<
	T extends MaybeRefOrGetter = unknown,
	Shallow extends boolean = boolean,
	IncludeExposed extends boolean = boolean,
	IncludeElements extends boolean = boolean
> = ExtendedRef<T, UnwrapRef<T>, {
	reset(): void;
	get error(): boolean;
	errors: DescriptorMarked<{
		value: ShallowRef<string[]>;
		unwrap: false;
	}>;
	validate(force?: boolean, trigger?: boolean): boolean;
	clear(): void;
} & (
	boolean extends IncludeExposed
		? { exposed?: Exposed }
		: IncludeExposed extends true
			? { exposed: Exposed }
			: {}
) & (
	boolean extends IncludeElements
		? { elements?: Elements }
		: IncludeElements extends true
			? { elements: Elements }
			: {}
), Shallow>

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