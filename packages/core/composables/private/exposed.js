export const definedInstances = new WeakMap()
export const definedElements = new WeakMap()
export const definedExposed = new WeakMap()

export const symTrigger = Symbol('trigger')
export const symHasInstance = Symbol('hasInstance')

export const getTrue = () => true