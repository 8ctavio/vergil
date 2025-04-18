import type { Ref, UnwrapRef } from "vue"
import type { ExtendedRef, DescriptorMarked, Prettify } from "."

declare const AUTO_UNWRAPPED_REF: unique symbol
declare const MAYBE_AUTO_UNWRAPPED: unique symbol

type AutoUnwrappedRef<T> = T & { [AUTO_UNWRAPPED_REF]: true }
type MaybeAutoUnwrapped<R> = (R | UnwrapRef<R>) & { [MAYBE_AUTO_UNWRAPPED]: true }

export type EntangledOptions = {
    defaults?: boolean;
    configurable?: boolean;
    enumberable?: boolean;
    writable?: boolean;
    ignore?: PropertyKey[];
}

type Ignore<O extends EntangledOptions = {}> = '__v_skip' | (
    'ignore' extends keyof O
        ? O['ignore'] extends PropertyKey[]
            ? string[] extends O['ignore']
                ? never
                : number[] extends O['ignore']
                    ? never
                    : symbol[] extends O['ignore']
                        ? never
                        : O['ignore'][number]
            : never
        : never
)

type EntangledExtension<
    E extends object,
    O extends EntangledOptions,
    I extends PropertyKey = never
> = {
    [K in Exclude<keyof E, Ignore<O> | I>]: E[K] extends Ref<infer V>
        ? AutoUnwrappedRef<V>
        : E[K] extends DescriptorMarked<infer D>
            ? 'value' extends keyof D
                ? D['value'] extends Ref<infer V>
                    ? 'unwrap' extends keyof D
                        ? D['unwrap'] extends false
                            ? D['value']
                            : MaybeAutoUnwrapped<D['value']>
                        : AutoUnwrappedRef<V>
                    : D['value']
                : 'get' extends keyof D
                    ? D['get'] extends (...args: any) => infer V
                        ? V
                        : undefined
                    : undefined
            : E[K]
}

type UnwrapExtension<T> = 
    T extends ExtendedRef<never, never, infer E> ? E :
    T extends Entangled<infer E> ? E : T

export type Entangled<
    T extends Record<PropertyKey, unknown> = {},
    O extends EntangledOptions = {},
> = EntangledExtension<T,O> & {
    getRef<K extends PropertyKey>(key: K): K extends keyof T
        ? T[K] extends AutoUnwrappedRef<infer V>
            ? Ref<V>
            : T[K] extends MaybeAutoUnwrapped<infer R>
                ? R | undefined
                : undefined
        : Ref<unknown> | undefined
    getRef(key: PropertyKey): Ref<unknown> | undefined

    extend<
        T extends object,
        E extends Record<PropertyKey, unknown>,
        O extends EntangledOptions = {}
    >(this: T, extension: E, options?: O): T extends ExtendedRef<infer R, infer U, infer D, infer Q>
        ? ExtendedRef<R, U, Prettify<D & UnwrapExtension<E>>, Q>
        : T extends Entangled<infer D>
            ? Entangled<Prettify<D & UnwrapExtension<E>>, O>
            : T & EntangledExtension<UnwrapExtension<E>, O>
    extend(extension: Record<PropertyKey, unknown>, options?: EntangledOptions): object
}