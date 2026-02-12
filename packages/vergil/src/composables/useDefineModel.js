import { customRef, toRaw, watchSyncEffect, getCurrentInstance } from "vue"
import { isFunction, ucFirst } from '#utilities'
import { useModel, isModel } from "#composables/useModel"
import { useExposed } from "#composables/useExposed"
import { useElements } from "#composables/useElements"
import { ModelWrapperImpl } from "#composables/.private/ModelWrapperImpl"

/**
 * @import { ModelWrapper, DefineModelOptions, ModelWrapperImplOptions, UnknownModel } from "#composables"
 */

/**
 * @template [T = unknown]
 * @template { boolean } [IncludeExposed = false]
 * @template { boolean } [CaptureExposed = false]
 * @template { boolean } [IncludeElements = false]
 * @template { boolean } [CaptureElements = false]
 * @overload
 * @param { DefineModelOptions<IncludeExposed, CaptureExposed, IncludeElements, CaptureElements> } [options]
 * @returns { ModelWrapper<T, IncludeExposed, CaptureExposed, IncludeElements, CaptureElements> }
 */
/**
 * Defines a bidirectional model-value bond between a (provided) model
 * and a component, and creates a model wrapper with additional utilities
 * to separately handle internal and external model value mutations.
 * 
 * @param { DefineModelOptions } [options]
 * @returns { UnknownModel }
 * 
 * @example
 *  ```vue
 *  <script setup>
 *  defineProps({
 *      modelValue: {
 *          type: [ModelValueType, Object],
 *          default: defaultModelValue
 *      },
 *      ['onUpdate:modelValue']: Function
 *  })
 *  const model = useDefineModel()
 *  </script>
 *  ```
 */
export function useDefineModel(options = {}) {
	const instance = getCurrentInstance()
	// @ts-expect-error
	if (!instance) return

	const { props } = instance
	const rawProps = toRaw(props)
	const { modelValue } = rawProps

	/** @type { UnknownModel } */
	const model = isModel(modelValue, true) ? modelValue
		: isFunction(rawProps['onUpdate:modelValue'])
			? useModel(customRef((track, trigger) => {
				let value = modelValue
				watchSyncEffect(() => {
					const v = props.modelValue
					if (!Object.is(value, v)) {
						value = v
						trigger()
					}
				})
				return {
					get: () => (track(), value),
					set: v => {
						if (!Object.is(value, v)) {
							/** @type { Function } */(rawProps['onUpdate:modelValue'])(v)
							value = v
							trigger()
						}
					}
				}
			}), { extendRef: true, validator: /** @type {any} */(rawProps.validator) })
			: useModel(modelValue, { shallow: true, validator: /** @type {any} */(rawProps.validator) })
	
	/** @type { ModelWrapperImplOptions } */
	const wrapperOptions = {
		maybeObject: options.maybeObject
	}
	const include = {
		elements: useElements,
		exposed: useExposed
	}
	for (const key of /**@type {const}*/(['elements', 'exposed'])) {
		const suffix = ucFirst(key)
		const value = (
			Boolean(options[`capture${suffix}`]) && (model[key] ?? rawProps[key])
		) || (
			options[`include${suffix}`] && include[key]()
		)
		if (value) {
			wrapperOptions[key] = /** @type { any } */(value)
		}
	}

	return new ModelWrapperImpl(model, wrapperOptions)
}