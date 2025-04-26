import { symTrigger, symHasInstance } from "../composables/private"
import type { ShallowRef } from "vue"
import type { Entangled } from "."

export type Exposed = Readonly<Record<string, any>>
export type Elements = Readonly<Record<string, HTMLElement | null>>

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