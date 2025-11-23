/**
 * @import { ReactiveEffect } from 'vue'
 */

export const _isScheduled_ = Symbol('isScheduled')

/**
 * @typedef { ReactiveEffect & { [_isScheduled_]?: boolean } } WatcherEffect
 */

export const privateModelMap = new WeakMap()