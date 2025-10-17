import { shallowRef, shallowReactive, markRaw, nextTick } from 'vue'
import { isFunction } from '#utilities'

/**
 * @import {
 *   ConcreteComponent,
 *   Component,
 *   ComponentOptions,
 *   DefineComponent,
 *   FunctionalComponent,
 *   ShallowRef,
 *   VNodeProps,
 * } from 'vue'
 */

/**
 * @type {(
 *     ShallowRef<{
 *         component: Component;
 *         props?: Record<string, unknown>;
 *     } | {
 *         component: null;
 *         props: null;
 *     }>
 * )}
 */
export const popup = shallowRef({
    component: null,
    props: null
})

/**
 * @type {{
 *     isLeaving: boolean;
 *     focusedBefore: Element | null;
 * }}
 */
export const popupMeta = shallowReactive({
    isLeaving: false,
    focusedBefore: null
})

export async function closePopup(closeBtn = false) {
    const onClose = popup.value.props?.onClose
    popupMeta.isLeaving = true
    await nextTick()
    popupMeta.focusedBefore = null
    popup.value = {
        component: null,
        props: null
    }
    if (closeBtn && isFunction(onClose)) onClose()
}

/**
 * @template P
 * @template { Record<string,any> } [S = any]
 * @overload
 * @param { FunctionalComponent<P,any,S,any> } component
 * @param { (RawProps & P) | ({} extends P ? null : never) } [props]
 * @returns { Promise<void> }
 */
/**
 * @template P
 * @overload
 * @param { ConcreteComponent<P> } component
 * @param { (RawProps & P) | ({} extends P ? null : never) } [props]
 * @returns { Promise<void> }
 */
/**
 * @template P
 * @overload
 * @param { Component<P> } component
 * @param { (RawProps & P) | null } [props]
 * @returns { Promise<void> }
 */
/**
 * @template P
 * @overload
 * @param { ComponentOptions<P> } component
 * @param { (RawProps & P) | ({} extends P ? null : never) } [props]
 * @returns { Promise<void> }
 */
/**
 * @template P
 * @overload
 * @param { Constructor<P> } component
 * @param { (RawProps & P) | ({} extends P ? null : never) } [props]
 * @returns { Promise<void> }
 */
/**
 * @template P
 * @overload
 * @param { DefineComponent<P> } component
 * @param { (RawProps & P) | ({} extends P ? null : never) } [props]
 * @returns { Promise<void> }
 */
/**
 * @template P
 * @overload
 * @param { Component<P> } component
 * @param { (RawProps & P) | ({} extends P ? null : never) } [props]
 * @returns { Promise<void> }
 */
/**
 * @see https://github.com/vuejs/core/blob/45547e6/packages/runtime-core/src/h.ts#L85
 * @param { Component } component
 * @param { Record<string, unknown> } [props]
 */
export async function showPopup(component, props) {
    if (popup.value.component) {
        popupMeta.isLeaving = true
        await nextTick()
    }
    popup.value = {
        component: markRaw(component),
        props
    }
}

/** @see https://github.com/vuejs/core/blob/45547e6/packages/runtime-core/src/h.ts#L56 */
/**
 * @typedef {(
 *   & VNodeProps
 *   & Record<string,any>
 *   & {
 *     __v_isVnode?: never;
 *     [Symbol.iterator]?: never;
 *   }
 * )} RawProps
 */
/** 
 * @template {any} P
 * @typedef {{
 *   __isFragment?: never;
 *   __isTeleport?: never;
 *   __isSuspense?: never;
 *   new (...args: any[]): { $props: P }
 * }} Constructor
 */