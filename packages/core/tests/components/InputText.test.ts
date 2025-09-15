import { vi, suite, test, expect, beforeAll, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vergil } from '#vergil'
import { InputText } from '#components'
import { useModel } from '#composables'

beforeAll(() => {
    vergil.init()
})

test('Set initial value', () => {
	const wrapper = mount(InputText, {
		props: {
			value: 'Vergil'
		}
	})
	expect(wrapper.get('input').element.value).toBe('Vergil')
})

test('Model value updates input value', async () => {
	const model = useModel('initial')
	const wrapper = mount(InputText, {
		props: {
			modelValue: model
		}
	})
	const input = wrapper.get('input')

	expect(input.element.value).toBe('initial')

	model.value = 'updated'
	await nextTick()
	expect(input.element.value).toBe('updated')
})

test('Input value updates model value', () => {
	const model = useModel('')
	const wrapper = mount(InputText, {
		props: {
			modelValue: model
		}
	})
	const input = wrapper.get('input')
	
	input.setValue('foo')
	input.trigger('input')
	expect(model.value).toBe('foo')
})

suite('Validation', () => {
	const validator = vi.fn((value, error) => {
		if (!value) error('empty')
	})
	beforeEach(() => {
		validator.mockClear()
	})

	test('Validate on input', async () => {
		const wrapper = mount(InputText, {
			props: {
				validator,
				eagerValidation: true,
				validationDelay: 0
			}
		})
		const input = wrapper.get('input')

		input.trigger('input')
		expect(validator).toHaveBeenCalledOnce()
	})

	test('Validate on enter', async () => {
		const wrapper = mount(InputText, {
			props: {
				validator,
				eagerValidation: true,
				validationCooldown: 0
			}
		})
		const input = wrapper.get('input')

		input.trigger('keydown.enter')
		expect(validator).toHaveBeenCalledOnce()
	})

	test('Validate lazily', () => {
		const model = useModel('', { validator })
		const wrapper = mount(InputText, {
			props: {
				modelValue: model,
				validationDelay: 0
			}
		})
		const input = wrapper.get('input')

		// Validator not called because there are no errors
		input.trigger('input')
		expect(validator).not.toHaveBeenCalled()

		// Validate programmatically
		model.validate()
		expect(validator).toHaveBeenCalledTimes(1)
		expect(model.error).toBe(true)

		// Validator called lazily until model has errors
		input.setValue('1')
		input.trigger('input')
		expect(validator).toHaveBeenCalledTimes(2)
		expect(model.error).toBe(false)

		// Validator not called again since errors have been cleared
		input.setValue('12')
		input.trigger('input')
		expect(validator).toHaveBeenCalledTimes(2)
	})

	test('Validate eagerly', () => {
		const model = useModel('', { validator })
		const wrapper = mount(InputText, {
			props: {
				modelValue: model,
				eagerValidation: true,
				validationDelay: 0
			}
		})
		const input = wrapper.get('input')

		// Validator called eagerly, despite model having no errors
		expect(model.error).toBe(false)
		input.trigger('input')
		expect(validator).toHaveBeenCalledTimes(1)
		expect(model.error).toBe(true)

		// Correct error
		input.setValue('1')
		input.trigger('input')
		expect(validator).toHaveBeenCalledTimes(2)
		expect(model.error).toBe(false)

		// Validator continues to be called
		input.setValue('12')
		input.trigger('input')
		expect(validator).toHaveBeenCalledTimes(3)
		expect(model.error).toBe(false)
	})

	test('Debounced input validation', async () => {
		const wrapper = mount(InputText, {
			props: {
				validator,
				eagerValidation: true,
				validationDelay: 1
			}
		})
		const input = wrapper.get('input')

		// Validator not executed immediately but scheduled into task queue
		input.trigger('input')
		expect(validator).toHaveBeenCalledTimes(0)
		await new Promise(resolve => {
			setTimeout(resolve, 20)
		})
		expect(validator).toHaveBeenCalledTimes(1)

		for (let i=0; i<10; i++) {
			input.setValue(i)
			input.trigger('input')
		}
		expect(validator).toHaveBeenCalledTimes(1)
		await new Promise(resolve => {
			setTimeout(resolve, 20)
		})
		expect(validator).toHaveBeenCalledTimes(2)
	})

	test('Debounced enter validation', async () => {
		const wrapper = mount(InputText, {
			props: {
				validator,
				eagerValidation: true,
				validationCooldown: 1
			}
		})
		const input = wrapper.get('input')

		// Validator executed eagerly once
		input.trigger('keydown.enter')
		expect(validator).toHaveBeenCalledTimes(1)

		// After first execution, validator is debounced
		input.setValue('foo')
		input.trigger('keydown.enter')
		expect(validator).toHaveBeenCalledTimes(1)
		await new Promise(resolve => {
			setTimeout(resolve, 20)
		})
		expect(validator).toHaveBeenCalledTimes(2)

		input.setValue('')
		input.trigger('keydown.enter')
		expect(validator).toHaveBeenCalledTimes(3)

		for (let i=0; i<10; i++) {
			input.setValue(i)
			input.trigger('keydown.enter')
		}
		expect(validator).toHaveBeenCalledTimes(3)
		await new Promise(resolve => {
			setTimeout(resolve, 20)
		})
		expect(validator).toHaveBeenCalledTimes(4)
	})

	test('Prevent enter validation', async () => {
		const wrapper = mount(InputText, {
			props: {
				validator,
				eagerValidation: true,
				preventEnterValidation: true,
				validationCooldown: 0
			}
		})
		const input = wrapper.get('input')

		input.trigger('keydown.enter')
		expect(validator).toHaveBeenCalledTimes(0)

		await wrapper.setProps({ preventEnterValidation: false })

		input.trigger('keydown.enter')
		expect(validator).toHaveBeenCalledTimes(1)
	})
})

test('Evenly space input value', () => {
	const wrapper = mount(InputText, {
		attachTo: document.body,
		props: {
			spaceEvenly: true
		}
	})

	const input = wrapper.get('input')
	input.element.focus()
	input.trigger('focus')
	input.setValue('  1  2   3  ')
	input.element.selectionStart = 4
	input.element.selectionEnd = 4
	input.trigger('blur')

	expect(input.element.value).toBe('1 2 3')
	expect(input.element.selectionStart).toBe(1)
	expect(input.element.selectionEnd).toBe(1)
})

test('Autoselect text on focus', () => {
	const wrapper = mount(InputText, {
		props: {
			value: '8',
			autoselect: true
		}
	})

	const input = wrapper.get<HTMLInputElement>('input')
	input.trigger('focusin')
	expect(input.element.selectionStart).toBe(0)
	expect(input.element.selectionEnd).toBe(1)
})

suite('Input icons', () => {
	test('Render left icon', async () => {
		const wrapper = mount(InputText)
		expect(wrapper.find('.input-text > .input-text-outer > .input-text-wrapper > .icon').exists()).toBe(false)

		// @ts-expect-error
		await wrapper.setProps({ iconLeft: 'rocket' })
		
		const icon = wrapper.find('.input-text > .input-text-outer > .input-text-wrapper > .icon:first-child')
		expect(icon.exists()).toBe(true)
		expect(icon.text()).toBe('rocket')
	})

	test('Render right icon', async () => {
		const wrapper = mount(InputText)
		expect(wrapper.find('.input-text > .input-text-outer > .input-text-wrapper > .icon').exists()).toBe(false)

		// @ts-expect-error
		await wrapper.setProps({ iconRight: 'rocket', label: 'abc' })
		
		const icon = wrapper.find('.input-text > .input-text-outer > .input-text-wrapper > .icon:last-child')
		expect(icon.exists()).toBe(true)
		expect(icon.text()).toBe('rocket')
	})

	test('icon prop precedes icon-left prop', async () => {
		const wrapper = mount(InputText, {
			props: {
				icon: 'rocket',
				iconLeft: 'forest'
			}
		})
		const icon = wrapper.find('.input-text > .input-text-outer > .input-text-wrapper > .icon:first-child')
		expect(icon.exists()).toBe(true)
		expect(icon.text()).toBe('rocket')
	})
})

suite('Input side buttons', () => {
	test('Render left button', async () => {
		const wrapper = mount(InputText)
		expect(wrapper.find('.input-text > .input-text-outer > .btn').exists()).toBe(false)

		// @ts-expect-error
		await wrapper.setProps({ btnBefore: { label: 'before' } })
		
		const btn = wrapper.find('.input-text > .input-text-outer > .btn:first-child')
		expect(btn.exists()).toBe(true)
		expect(btn.text()).toBe('before')
	})

	test('Render right button', async () => {
		const wrapper = mount(InputText)
		expect(wrapper.find('.input-text > .input-text-outer > .btn').exists()).toBe(false)

		// @ts-expect-error
		await wrapper.setProps({ btnAfter: { label: 'after' } })
		
		const btn = wrapper.find('.input-text > .input-text-outer > .btn:last-child')
		expect(btn.exists()).toBe(true)
		expect(btn.text()).toBe('after')
	})
})