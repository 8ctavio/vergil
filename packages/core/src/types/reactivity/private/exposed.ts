import type { ShallowRef } from "vue"
import type { symTrigger, symHasInstance } from "#composables"
import type { Entangled } from "#reactivity"

export type InternalExposed = Record<string, unknown> & {
	[symTrigger]: () => void;
	[symHasInstance]?: boolean;
}
export type InternalElements = Entangled<
	Record<string, ShallowRef<HTMLElement | null>> & {
		[symTrigger]?: () => void;
		[symHasInstance]?: boolean;
	}
>