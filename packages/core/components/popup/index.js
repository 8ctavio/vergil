import { shallowRef, shallowReactive, markRaw, nextTick } from 'vue'
import { isFunction } from '#utilities'

/**
 * @import { ShallowRef, ComponentPublicInstance } from 'vue'
 */

/**
 * @type {(
 *     ShallowRef<{
 *         component: ComponentPublicInstance;
 *         props: Record<string, unknown>;
 *     } | {
 *         component: null;
 *         props: null;
 *     }>
 * )}
 */
const popup = shallowRef({
    component: null,
    props: null
})

/**
 * @type {{
 *     isLeaving: boolean;
 *     focusedBefore: Element | null;
 * }}
 */
const popupMeta = shallowReactive({
    isLeaving: false,
    focusedBefore: null
})

/**
 * @param { ComponentPublicInstance } component
 * @param { Record<string, unknown> } props 
 */
async function showPopup(component, props) {
    if (popup.value.component) {
        popupMeta.isLeaving = true
        await nextTick()
    }
    popup.value = {
        component: markRaw(component),
        props
    }
}
async function closePopup(closeBtn = false) {
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

export {
    popup,
    popupMeta,
    showPopup,
    closePopup,
}