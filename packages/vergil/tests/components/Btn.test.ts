import { suite, test, expect, vi, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { vergil } from '#vergil'
import { Btn } from '#components'

beforeAll(() => {
    vergil.init()
})

suite('Button label', () => {
    test('label prop renders button label', () => {
        const wrapper = mount(Btn, {
            props: {
                label: 'Vergil',
            }
        })
        expect(wrapper.get('.btn > .btn-content').text()).toBe('Vergil')
    })

    test('Default slot renders button label', () => {
        const wrapper = mount(Btn, {
            slots: {
                default: 'Vergil'
            }
        })
        expect(wrapper.get('.btn > .btn-content').text()).toBe('Vergil')
    })

    test('Default slot overrides label prop', () => {
        const wrapper = mount(Btn, {
            props: {
                label: 'Overridden'
            },
            slots: {
                default: 'Vergil'
            }
        })
        expect(wrapper.get('.btn > .btn-content').text()).toBe('Vergil')
    })
})

suite('Button icons', () => {
    test('Render left icon', async () => {
        const wrapper = mount(Btn, {
            slots: {
                default: h('p', 'Label')
            }
        })
        expect(wrapper.find('.btn > .btn-content > .icon').exists()).toBe(false)

        await wrapper.setProps({ iconLeft: 'rocket' })
        
        const icon = wrapper.find('.btn > .btn-content > .icon:first-child')
        expect(icon.exists()).toBe(true)
        expect(icon.text()).toBe('rocket')
    })

    test('Render right icon', async () => {
        const wrapper = mount(Btn, {
            slots: {
                default: h('p', 'Label')
            }
        })
        expect(wrapper.find('.btn > .btn-content > .icon').exists()).toBe(false)

        await wrapper.setProps({ iconRight: 'rocket', label: 'abc' })
        
        const icon = wrapper.find('.btn > .btn-content > .icon:last-child')
        expect(icon.exists()).toBe(true)
        expect(icon.text()).toBe('rocket')
    })

    test('icon prop precedes icon-left prop', async () => {
        const wrapper = mount(Btn, {
            props: {
                icon: 'rocket',
                iconLeft: 'forest'
            },
            slots: {
                default: h('p', 'Label')
            }
        })
        const icon = wrapper.find('.btn > .btn-content > .icon:first-child')
        expect(icon.exists()).toBe(true)
        expect(icon.text()).toBe('rocket')
    })
})

test('Click event listener', () => {
    const spy = vi.fn()
    const wrapper = mount(Btn, {
        props: {
            onClick: spy
        }
    })
    wrapper.get('.btn').trigger('click')
    expect(spy).toHaveBeenCalledOnce()
})

test('Button is not interactive when disabled', async () => {
    const spy = vi.fn()
    const wrapper = mount(Btn, {
        props: {
            onClick: spy
        }
    })
    const btn = wrapper.get('.btn')

    await wrapper.setProps({
        disabled: true,
        loading: false
    })
    btn.trigger('click')
    expect(spy).not.toHaveBeenCalled()

    await wrapper.setProps({
        disabled: false,
        loading: true
    })
    btn.trigger('click')
    expect(spy).not.toHaveBeenCalled()

    await wrapper.setProps({
        disabled: false,
        loading: false
    })
    btn.trigger('click')
    expect(spy).toHaveBeenCalledOnce()
})

test('Render loading spinner', async () => {
    const wrapper = mount(Btn)
    expect(wrapper.find('.btn > .btn-content > .btn-loader').exists()).toBe(false)
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('.btn > .btn-content > .btn-loader').exists()).toBe(true)
})

test('outline: true is equivalent to outline: "regular"', async () => {
    const wrapper = mount(Btn, {
        props: {
            outline: 'regular'
        }
    })
    expect(wrapper.get('.btn').classes()).toContain('outline-regular')
    await wrapper.setProps({ outline: true })
    expect(wrapper.get('.btn').classes()).toContain('outline-regular')
})