import { test, expect } from 'vitest'
import { prune } from "../../utilities"

test('Trim, evenly space, remove diacritics, and lowercase string', () => {
	expect(prune(' ÁÉ1  ÍÓ2  ÚÑ3  ')).toBe('ae1 io2 un3')
	expect(prune(' Verdad  y   Reconciliación   ')).toBe('verdad y reconciliacion')
})