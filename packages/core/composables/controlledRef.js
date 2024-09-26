import { customRef, toValue } from 'vue'
import { extendedRef } from './extendedRef'

/**
 * Creates an extended ref with custom `.value` accessors (getter and setter) and methods to control (a) effect tracking and triggering and (b) calling custom or default getter and setter.
 * 
 * @template T, [U=T]
 * @param { T } value - The controlled ref's inner value
 * @param { {
 *      get?: ({ getValue, setValue }: {
 *          getValue: () => T;
 *          setValue: (v: T) => void;
 *      }) => T;
 *      set?: (v: U, { getValue, setValue }: {
 *          getValue: () => T;
 *          setValue: (v: T) => void;
 *      }) => void;
 * } } [customAccessor] - An object with `get` and `set` methods, the controlled ref's custom accessors.
 * 
 * @returns { ExtendedRef<T> } An extended controlled ref.
 * 
 * @example
 *  const controlled = controlledRef(0, {
 *      get({ getValue }) {
 *          console.log('custom getter')
 *          return getValue()
 *      },
 *      set(v, { setValue }) {
 *          console.log('custom setter)
 *          setValue(v)
 *      },
 *  })
 * 
 *  //----- Control effect tracking/triggering -----
 *  watchEffect(() => {
 *      console.log(controlled.value) // tracked
 *  })
 *  watchEffect(() => {
 *      console.log(controlled.peek()) // not tracked
 *  })
 *  
 *  controlled.value = 1 // trigger effects
 *  controlled.lay(2) // does not trigger effects
 * 
 *  controlled.get({ track: false }) // sames as .peek()
 *  controlled.set(3, { trigger: false }) // same as .lay()
 * 
 *  //----- Control calling custom getter/setter -----
 *  // return extended ref's inner value without running custom getter
 *  controlled.get({ custom: false })
 *  // update extended ref's inner value without running custom setter
 *  controlled.set(4, { custom: false })
 */
export function controlledRef(value, customAccessor = {}) {
    value = toValue(value)
    const getValue = () => value
    const setValue = v => value = v

    const {
        get = getValue,
        set = setValue,
    } = customAccessor
    
    let track, trigger
    function customGet({ custom = true, track: _track = true } = {}) {
        if(_track) track()
        return (custom ? get : getValue).call(controlled, { getValue, setValue })
    }
    function customSet(v, { custom = true, trigger: _trigger = true } = {}) {
        (custom ? set : setValue).call(controlled, v, { getValue, setValue })
        if(_trigger) trigger()
    }

    const custom = customRef((...args) => {
        [track, trigger] = args
        return {
            get: customGet,
            set: customSet,
        }
    })
    const controlled = extendedRef(custom, {
        get: customGet,
        set: customSet,
        peek({ custom = true } = {}) {
            return customGet({ custom, track: false })
        },
        lay(v, { custom = true } = {}) {
            customSet(v, { custom, trigger: false })
        }
    }, { configurable: false })

    return controlled
}