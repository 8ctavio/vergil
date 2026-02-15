import type { Ref } from "vue"
import type { EntangledProperties } from "#reactivity"
import type { DescriptorMarked } from "#utilities"

export type EntangledOptions<Ignore extends PropertyKey = PropertyKey> = {
    /**
     * Default value of the `configurable`, `enumerable`, and `writable` options.
     * @default true
     */
    defaults?: boolean;
    /**
     * Default `configurable` property value for descriptors of newly created properties.
     * @default defaults
     */
    configurable?: boolean;
    /**
     * Default `enumerable` property value for descriptors of newly created properties.
     * @default defaults
     */
    enumerable?: boolean;
    /**
     * Default `writable` property value for descriptors of newly created properties.
     * @default defaults
     */
    writable?: boolean;
    /**
     * Array of property keys not to be defined on the underlying
     * entangled object.
     */
    ignore?: Ignore[];
}

export type EntangledDescriptor = PropertyDescriptor & {
    unwrap?: boolean
}

export type Entangled<
    E extends Record<PropertyKey, unknown> = {},
    Ignore extends PropertyKey = never
> = EntangledProperties<E, Ignore> & {
    getRef<K extends PropertyKey>(key: K): K extends keyof E
        ? E[K] extends Ref
            ? E[K]
            : E[K] extends DescriptorMarked<infer D>
                ? 'value' extends keyof D
                    ? D['value'] extends Ref
                        ? 'unwrap' extends keyof D
                            ? D['unwrap'] extends false
                                ? undefined
                                : D['value'] | undefined
                            : D['value']
                        : undefined
                    : undefined
                : undefined
        : Ref<unknown> | undefined
    getRef(key: PropertyKey): Ref<unknown> | undefined
}