import { suite, test, expectTypeOf } from 'vitest'
import { markDescriptor, isDescriptor, dataDescriptor } from '#utilities/descriptor'
import type { DescriptorMarked } from '#utilities/descriptor.types'

suite('markDescriptor', () => {
	test('Return a DescriptorMarked object ', () => {
		const desc = { foo: 0, bar: '', baz: false }
		expectTypeOf(markDescriptor({})).toExtend<DescriptorMarked<object>>()
		expectTypeOf(markDescriptor(desc)).toEqualTypeOf<DescriptorMarked<typeof desc>>()
	})
})

suite('isDescriptor', () => {
	test('DescriptorMarked type guard', () => {
		expectTypeOf(isDescriptor).guards.toExtend<DescriptorMarked<object>>()
	})
})

suite('dataDescriptor', () => {
	test('Return DescriptorMarked object with data descriptor properties', () => {
		expectTypeOf(dataDescriptor).returns.toEqualTypeOf<DescriptorMarked<{
			value: unknown;
			writable?: boolean;
			enumerable?: boolean;
			configurable?: boolean;
		}>>()
	})
})