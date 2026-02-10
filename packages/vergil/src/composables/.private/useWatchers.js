/**
 * @import { ReactiveEffect } from 'vue'
 */

/**
 * @typedef { ReactiveEffect & { [_isScheduled_]?: boolean } } WatcherEffect
 */

export const _isScheduled_ = Symbol('isScheduled')