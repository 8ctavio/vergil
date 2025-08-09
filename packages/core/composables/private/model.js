/**
 * @import { ReactiveEffect } from 'vue'
 */

export const isScheduled = Symbol('isScheduled')

/**
 * @typedef { ReactiveEffect & { [isScheduled]?: boolean } } WatcherEffect
 */

export const privateModelMap = new WeakMap()