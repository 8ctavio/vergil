import { Entangled, ExtendedRef } from "../reactivity/private"

export function isEntangled(value) {
	return value instanceof Entangled
}

export function isExtendedRef(value) {
	return value instanceof ExtendedRef
}