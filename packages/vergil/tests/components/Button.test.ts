import { suite, test, expect, vi, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { vergil } from '#vergil'
import { Button } from '#components'

beforeAll(() => {
    vergil.init()
})

suite('Button label', () => {
    test('label prop renders button label', () => {
        const wrapper = mount(Button, {
            props: {
                label: 'Vergil',
            }
        })
        expect(wrapper.get('.button > .button-content').text()).toBe('Vergil')
    })

    test('Default slot renders button label', () => {
        const wrapper = mount(Button, {
            slots: {
                default: 'Vergil'
            }
        })
        expect(wrapper.get('.button > .button-content').text()).toBe('Vergil')
    })

    test('Default slot overrides label prop', () => {
        const wrapper = mount(Button, {
            props: {
                label: 'Overridden'
            },
            slots: {
                default: 'Vergil'
            }
        })
        expect(wrapper.get('.button > .button-content').text()).toBe('Vergil')
    })
})

suite('Button icons', () => {
    test('Render left icon', async () => {
        const wrapper = mount(Button, {
            slots: {
                default: h('p', 'Label')
            }
        })
        expect(wrapper.find('.button > .button-content > .icon').exists()).toBe(false)

        await wrapper.setProps({ iconLeft: 'rocket' })
        
        const icon = wrapper.find('.button > .button-content > .icon:first-child')
        expect(icon.exists()).toBe(true)
        expect(icon.text()).toBe('rocket')
    })

    test('Render right icon', async () => {
        const wrapper = mount(Button, {
            slots: {
                default: h('p', 'Label')
            }
        })
        expect(wrapper.find('.button > .button-content > .icon').exists()).toBe(false)

        await wrapper.setProps({ iconRight: 'rocket', label: 'abc' })
        
        const icon = wrapper.find('.button > .button-content > .icon:last-child')
        expect(icon.exists()).toBe(true)
        expect(icon.text()).toBe('rocket')
    })

    test('icon prop precedes icon-left prop', async () => {
        const wrapper = mount(Button, {
            props: {
                icon: 'rocket',
                iconLeft: 'forest'
            },
            slots: {
                default: h('p', 'Label')
            }
        })
        const icon = wrapper.find('.button > .button-content > .icon:first-child')
        expect(icon.exists()).toBe(true)
        expect(icon.text()).toBe('rocket')
    })
})

test('Click event listener', () => {
    const spy = vi.fn()
    const wrapper = mount(Button, {
        props: {
            onClick: spy
        }
    })
    wrapper.get('.button').trigger('click')
    expect(spy).toHaveBeenCalledOnce()
})

test('Button is not interactive when disabled', async () => {
    const spy = vi.fn()
    const wrapper = mount(Button, {
        props: {
            onClick: spy
        }
    })
    const button = wrapper.get('.button')

    await wrapper.setProps({
        disabled: true,
        loading: false
    })
    button.trigger('click')
    expect(spy).not.toHaveBeenCalled()

    await wrapper.setProps({
        disabled: false,
        loading: true
    })
    button.trigger('click')
    expect(spy).not.toHaveBeenCalled()

    await wrapper.setProps({
        disabled: false,
        loading: false
    })
    button.trigger('click')
    expect(spy).toHaveBeenCalledOnce()
})

test('Render loading spinner', async () => {
    const wrapper = mount(Button)
    expect(wrapper.find('.button > .button-content > .button-loader').exists()).toBe(false)
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('.button > .button-content > .button-loader').exists()).toBe(true)
})

test('outline: true is equivalent to outline: "regular"', async () => {
    const wrapper = mount(Button, {
        props: {
            outline: 'regular'
        }
    })
    expect(wrapper.get('.button').classes()).toContain('outline-regular')
    await wrapper.setProps({ outline: true })
    expect(wrapper.get('.button').classes()).toContain('outline-regular')
})