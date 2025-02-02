import { isExtendedRef } from "../extendedReactivity"

export const symModelWatchers = Symbol('model-watchers')

export function hasModel(value) {
	return isExtendedRef(value) && ('__v_isModel' in value)
}