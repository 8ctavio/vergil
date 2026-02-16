import type { EntangledImpl, EntangledProperties } from "#reactivity"

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
    P extends Record<PropertyKey, unknown> = {},
    Ignore extends PropertyKey = never
> = EntangledImpl & EntangledProperties<P, Ignore>