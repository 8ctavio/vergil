import type { ShallowRef } from "vue"
import type { _trigger_, _hasComponent_ } from "#composables"
import type { Entangled } from "#reactivity"

export type InternalExposed = Readonly<ShallowRef<Record<string, unknown>>> & {
	[_hasComponent_]?: boolean;
}
export type InternalElements = Entangled<
	Record<string, ShallowRef<HTMLElement | null>> & {
		[_trigger_]?: () => void;
		[_hasComponent_]?: boolean;
	}
>