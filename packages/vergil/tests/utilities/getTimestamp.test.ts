import { test, expect, vi } from 'vitest'
import { getTimestamp } from '#utilities'

test('Get current timestamp', () => {
	vi.useFakeTimers()
	vi.setSystemTime(8000)

	expect(getTimestamp()).toBe(8000)

	vi.useRealTimers()
})

test('Get current timestamp in seconds', () => {
	vi.useFakeTimers()
	vi.setSystemTime(8800)

	expect(getTimestamp({ unit: 's' })).toBe(8)

	vi.useRealTimers()
})

test('Convert timestamp to seconds', () => {
	expect(getTimestamp({
		from: 8000,
		unit: 's'
	})).toBe(8)

	expect(getTimestamp({
		from: 1500,
		unit: 's'
	})).toBe(1)

	expect(getTimestamp({
		from: 999,
		unit: 's'
	})).toBe(0)

	expect(getTimestamp({
		from: -1800,
		unit: 's'
	})).toBe(-1)

	expect(getTimestamp({
		from: -2999,
		unit: 's'
	})).toBe(-2)
})

test('Get offset timestamp', () => {
	expect(getTimestamp({
		from: 0,
		unit: 's',
		offset: { s: 1 }
	})).toBe(1)

	expect(getTimestamp({
		from: 0,
		unit: 's',
		offset: { m: 1 }
	})).toBe(60)

	expect(getTimestamp({
		from: 0,
		unit: 's',
		offset: { h: 1 }
	})).toBe(3600)

	expect(getTimestamp({
		from: 0,
		unit: 's',
		offset: { d: 1 }
	})).toBe(86_400)

	expect(getTimestamp({
		from: 0,
		unit: 'ms',
		offset: { s: -1 }
	})).toBe(-1_000)

	expect(getTimestamp({
		from: 0,
		unit: 'ms',
		offset: { m: -1 }
	})).toBe(-60_000)

	expect(getTimestamp({
		from: 0,
		unit: 'ms',
		offset: { h: -1 }
	})).toBe(-3_600_000)

	expect(getTimestamp({
		from: 0,
		unit: 'ms',
		offset: { d: -1 }
	})).toBe(-86_400_000)

	expect(getTimestamp({
		from: 0,
		offset: {
			s: 30,
			m: 30,
			h: 12,
			d: 1
		}
	})).toBe(131_430_000)

	expect(getTimestamp({
		from: 0,
		offset: {
			s: -30,
			m: 30,
			h: 12,
			d: -1
		}
	})).toBe(-41_430_000)
})