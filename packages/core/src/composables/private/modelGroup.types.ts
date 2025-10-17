import type { ModelGroupValidator } from "#composables"

export type ModelGroupInternal = {
	readonly __modelGroup: true;
	readonly __validator: ModelGroupValidator;
}