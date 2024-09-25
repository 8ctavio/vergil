import { customRef, toValue } from 'vue'

/** 
 * @template T
 * @typedef { import('vue').Ref<T> } Ref<T>
 * */

/**
 * Creates ref with custom `.value` accessors (getter and setter) and control over tracking and triggering effects.
 * 
 * @template T, [U=T]
 * @param { T } value - The ref's inner value.
 * @param { {
 *      get?: ({ getValue, setValue }: {
 *          getValue: () => T;
 *          setValue: (v: T) => void;
 *      }) => T;
 *      set?: (v: U, { getValue, setValue }: {
 *          getValue: () => T;
 *          setValue: (v: T) => void;
 *      }) => void;
 * } | (({ track, trigger, getValue, setValue }: {
 *      track: () => void;
 *      trigger: () => void;
 *      getValue: () => T;
 *      setValue: (v: T) => void;
 *  }) => {
 *      get?: () => T;
 *      set?: (v: U) => void
 *  }) } [customAccessor] - An object with `get` and `set` methods, or function that returns one.
 * 
 * @returns { Ref<T> } A custom ref
 * 
 * @example
 *  // Custom ref with factory function
 *  const custom = useCustomRef(0, ({ track, trigger, getValue, setValue }) => ({
 *      get() {
 *          if(readEnabled) {
 *              track()
 *              return getValue()
 *          }
 *      },
 *      set(v) {
 *          if(writeEnabled) {
 *              setValue(v)
 *              trigger()
 *          }
 *      }
 *  }))
 * 
 *  // Ref with custom accessors
 *  const custom = useCustomRef('', {
 *      get({ getValue }) {
 *          return readEnabled ? getValue() : 'default'
 *      },
 *      set(v, { setValue }) {
 *          setValue(writeEnabled ? setValue(v) : 'default')
 *      }
 *  })
 */
export function useCustomRef(value, customAccessor = {}) {
    value = toValue(value)
    const getValue = () => value
    const setValue = v => value = v

    if(typeof customAccessor === 'function') {
        return customRef((track, trigger) => {
            const {
                get = () => {
                    track()
                    return getValue()
                },
                set = v => {
                    setValue(v)
                    trigger()
                }
            } = customAccessor({ track, trigger, getValue, setValue })
            return { get, set }
        })
    } else {
        const {
            get: customGet = getValue,
            set: customSet = setValue,
        } = customAccessor

        return customRef((track, trigger) => ({
            get() {
                track()
                return customGet({ getValue, setValue })
            },
            set(v) {
                customSet(v, { getValue, setValue })
                trigger()
            }
        }))
    }
}