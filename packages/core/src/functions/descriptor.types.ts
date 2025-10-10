declare const descriptorMark: unique symbol
export type DescriptorMarked<T extends object> = T & { [descriptorMark]: true }