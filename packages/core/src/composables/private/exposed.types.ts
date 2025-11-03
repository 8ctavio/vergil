import type { ShallowRef } from "vue"
import type { _hasInstance_, symTrigger, symHasInstance } from "#composables"
import type { Entangled } from "#reactivity"

export type InternalExposed = Readonly<ShallowRef<Record<string, unknown>>> & {
	[_hasInstance_]?: boolean;
}
export type InternalElements = Entangled<
	Record<string, ShallowRef<HTMLElement | null>> & {
		[symTrigger]?: () => void;
		[symHasInstance]?: boolean;
	}
>