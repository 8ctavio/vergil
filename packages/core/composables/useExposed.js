import { shallowRef, unref, markRaw } from "vue"
import { definedExposed, symTrigger, getTrue } from "./private"

export function useExposed() {
	const dep = shallowRef().dep
	const track = dep.track.bind(dep)
	const exposed = markRaw({
		[symTrigger]: dep.trigger.bind(dep)
	})
	const exposedProxy = new Proxy(exposed, {
		get(target, property) {
			if(typeof property === 'string') {
				track()
				const descriptor = Object.getOwnPropertyDescriptor(target, property)
				return descriptor && (Object.hasOwn(descriptor, 'value') || descriptor.get)
					? unref(target[property])
					: undefined
			} else {
				return undefined
			}
		},
		set: getTrue,
		defineProperty: getTrue,
		deleteProperty: getTrue,
		setPrototypeOf: getTrue,
	})
	definedExposed.set(exposedProxy, exposed)
	return exposedProxy
}