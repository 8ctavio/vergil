import { test, expect } from 'vitest'
import { kebabCase } from "../../utilities"

test('Convert sentence case to kebab case', () => {
	expect(kebabCase('Foo bar BAZ quX')).toBe('foo-bar-baz-qux')
})

test('Ignore non-alphanumeric characters', () => {
	expect(kebabCase('  Foo  BAR - BaZ_qux ')).toBe('foo-bar-baz-qux')
})

test('Remove diacritics', () => {
	expect(kebabCase('El Cartógrafo Silencioso')).toBe('el-cartografo-silencioso')
})