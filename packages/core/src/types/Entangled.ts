import type { Ref } from "vue"
import type { ExtendedRef, DescriptorMarked, Prettify } from "."

export interface EntangledOptions<Ignore extends PropertyKey = never> {
    defaults?: boolean;
    configurable?: boolean;
    enumerable?: boolean;
    writable?: boolean;
    ignore?: Ignore[];
}

type EntangledExtension<E extends object, Ignore extends PropertyKey> = Omit<{
    [K in keyof E]: E[K] extends Ref<infer V>
        ? V
        : E[K] extends DescriptorMarked<infer D>
            ? 'value' extends keyof D
                ? D['value'] extends Ref<infer V>
                    ? 'unwrap' extends keyof D
                        ? D['unwrap'] extends false
                            ? D['value']
                            : V | D['value']
                        : V
                    : D['value']
                : 'get' extends keyof D
                    ? D['get'] extends (...args: any) => infer V
                        ? V
                        : undefined
                    : undefined
            : E[K]
}, Ignore>

type UnwrapExtension<T> = 
    T extends ExtendedRef<never, never, infer E> ? E :
    T extends Entangled<infer E> ? E : T

export type Entangled<
    E extends Record<PropertyKey, unknown> = {},
    Ignore extends PropertyKey = never
> = EntangledExtension<E, Ignore> & {
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

    extend<
        T extends object,
        E extends Record<PropertyKey, unknown>,
        Ignore extends PropertyKey = never
    >(this: T, extension: E, options?: EntangledOptions<Ignore>): T extends ExtendedRef<infer V, infer U, infer D, infer S, infer I>
        ? ExtendedRef<V, U, Prettify<D & UnwrapExtension<E>>, S, I>
        : T extends Entangled<infer D>
            ? Entangled<Prettify<D & UnwrapExtension<E>>, Ignore>
            : T & EntangledExtension<UnwrapExtension<E>, Ignore>
    extend(extension: Record<PropertyKey, unknown>, options?: EntangledOptions): object
}